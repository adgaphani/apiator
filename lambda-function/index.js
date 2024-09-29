const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { apiName, method, payload, responseModel, responseItems } = JSON.parse(event.body);

    const params = {
        TableName: 'UserAPITable', // Replace with your DynamoDB table name
        Item: {
            apiId: `${apiName}-${method}`, // Unique ID for each API
            apiName,
            method,
            payload,
            responseModel,
            responseItems,
            createdAt: new Date().toISOString(),
        }
    };

    try {
        await dynamoDB.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'API created successfully!' }),
        };
    } catch (error) {
        console.error('Error creating API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to create API', error }),
        };
    }
};
