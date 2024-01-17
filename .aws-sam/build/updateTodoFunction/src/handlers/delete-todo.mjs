
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TODO_TABLE_NAME = process.env.TODO_TABLE_NAME;


export const deleteTodo = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`deleteTodo only accept DELETE method, you tried: ${event.httpMethod}`);
    }
    console.info('received:', event);
    let todoId=event.pathParameters.id;

    var params = {
        TableName : TODO_TABLE_NAME,
        Key: { todoId : todoId}
    };

    try {
        const data = await ddbDocClient.send(new DeleteCommand(params));
        var message = "The todo with id " + todoId + " has been deleted!";
    } catch (err) {
        console.log("Error", err);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(message)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
