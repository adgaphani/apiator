const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoDBAdmin = new AWS.DynamoDB(); // For creating new tables

const API_BASE_URL = 'https://apiator.live'; // Your domain

exports.handler = async (event) => {
    const { action, apiName, requestId, requestData, responseData } = JSON.parse(event.body);
    const userId = event.requestContext.identity.cognitoIdentityId;
    const apiId = `${userId}-${apiName}-POST`; // Assuming POST method, adapt as needed

    if (action === 'create') {
        // If the action is 'create', create a new API and its respective DynamoDB table
        try {
            // Create a new table for the API
            const createTableParams = {
                TableName: `${apiId}-DataTable`,
                KeySchema: [{ AttributeName: 'requestId', KeyType: 'HASH' }], // Primary key for API data
                AttributeDefinitions: [{ AttributeName: 'requestId', AttributeType: 'S' }],
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
            };

            await dynamoDBAdmin.createTable(createTableParams).promise();

            // Store API metadata in UserAPITable
            const apiMetadataParams = {
                TableName: 'UserAPITable',
                Item: {
                    apiId,
                    userId,
                    apiName,
                    createdAt: new Date().toISOString(),
                    apiDataTableName: `${apiId}-DataTable` // Reference to the dedicated table
                }
            };

            await dynamoDB.put(apiMetadataParams).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'API and dedicated database created successfully!',
                    endpoint: `${API_BASE_URL}/${apiName}`
                }),
            };
        } catch (error) {
            console.error('Error creating API or table:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to create API or table', error }),
            };
        }
    }

    // For other actions (handling API calls):
    try {
        // Fetch API metadata (to retrieve correct table name)
        const metadataParams = {
            TableName: 'UserAPITable',
            Key: { apiId }
        };

        const apiMetadata = await dynamoDB.get(metadataParams).promise();
        const apiDataTable = apiMetadata.Item.apiDataTableName; // Get the dedicated table for this API

        // Now store the request/response in the correct table
        const params = {
            TableName: apiDataTable,
            Item: {
                requestId,
                requestData,
                responseData,
                createdAt: new Date().toISOString(),
            }
        };

        await dynamoDB.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Request and response logged successfully!' }),
        };
    } catch (error) {
        console.error('Error logging request/response:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to log request/response', error }),
        };
    }
};
