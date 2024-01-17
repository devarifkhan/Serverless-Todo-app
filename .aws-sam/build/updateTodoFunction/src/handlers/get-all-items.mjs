
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TODO_TABLE_NAME = process.env.TODO_TABLE_NAME;


export const getAllItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);

    var params = {
        TableName : TODO_TABLE_NAME
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        var items = data.Items;
    } catch (err) {
        console.log("Error", err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
