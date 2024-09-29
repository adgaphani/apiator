// Import AWS SDK v3 DynamoDB client
const { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDb = new DynamoDBClient({ region: 'your-region' }); // Replace 'your-region' with the correct AWS region

exports.handler = async (event) => {
    let response;
    try {
        const { httpMethod, path, queryStringParameters, body } = event;

        switch (httpMethod) {
            case 'POST':
                // Create a new API entry in DynamoDB
                response = await createAPI(JSON.parse(body));
                break;
            case 'GET':
                // If an apiId is provided, get a specific API, else list all APIs
                if (queryStringParameters && queryStringParameters.apiId) {
                    response = await getAPI(queryStringParameters.apiId);
                } else {
                    response = await listAPIs();
                }
                break;
            case 'PUT':
                // Update an existing API
                response = await updateAPI(JSON.parse(body));
                break;
            case 'DELETE':
                // Delete an API based on apiId
                response = await deleteAPI(queryStringParameters.apiId);
                break;
            default:
                response = {
                    statusCode: 405,
                    body: JSON.stringify({ message: "Method Not Allowed" }),
                };
                break;
        }
    } catch (error) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        };
    }
    return response;
};

// Function to create a new API
const createAPI = async (apiData) => {
    const params = {
        TableName: 'apiatorv2TBDB', // Your DynamoDB table name
        Item: {
            apiId: { S: `${Date.now()}` }, // Unique ID for the API
            apiName: { S: apiData.apiName },
            method: { S: apiData.method },
            payload: { S: JSON.stringify(apiData.payload) }, // Store payload as JSON string
            responseModel: { S: JSON.stringify(apiData.responseModel) }, // Store response model as JSON string
            createdAt: { S: new Date().toISOString() },
            status: { S: 'active' },
        },
    };

    try {
        await dynamoDb.send(new PutItemCommand(params));
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'API created successfully' }),
        };
    } catch (error) {
        throw new Error(`Could not create API: ${error.message}`);
    }
};

// Function to get a specific API by apiId
const getAPI = async (apiId) => {
    const params = {
        TableName: 'apiatorv2TBDB',
        Key: {
            apiId: { S: apiId },
        },
    };

    try {
        const data = await dynamoDb.send(new GetItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item ? data.Item : { message: 'API not found' }),
        };
    } catch (error) {
        throw new Error(`Could not get API: ${error.message}`);
    }
};

// Function to list all APIs
const listAPIs = async () => {
    const params = {
        TableName: 'apiatorv2TBDB',
    };

    try {
        const data = await dynamoDb.send(new ScanCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        throw new Error(`Could not list APIs: ${error.message}`);
    }
};

// Function to update an existing API
const updateAPI = async (apiData) => {
    // Assuming you are updating only certain fields
    const params = {
        TableName: 'apiatorv2TBDB',
        Item: {
            apiId: { S: apiData.apiId }, // Must include apiId to update the correct API
            apiName: { S: apiData.apiName },
            method: { S: apiData.method },
            payload: { S: JSON.stringify(apiData.payload) },
            responseModel: { S: JSON.stringify(apiData.responseModel) },
            status: { S: apiData.status },
            updatedAt: { S: new Date().toISOString() },
        },
    };

    try {
        await dynamoDb.send(new PutItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'API updated successfully' }),
        };
    } catch (error) {
        throw new Error(`Could not update API: ${error.message}`);
    }
};

// Function to delete an API by apiId
const deleteAPI = async (apiId) => {
    const params = {
        TableName: 'apiatorv2TBDB',
        Key: {
            apiId: { S: apiId },
        },
    };

    try {
        await dynamoDb.send(new DeleteItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'API deleted successfully' }),
        };
    } catch (error) {
        throw new Error(`Could not delete API: ${error.message}`);
    }
};
