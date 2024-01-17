
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TODO_TABLE_NAME = process.env.TODO_TABLE_NAME;


export const createTodo = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    console.info('received:', event);

    const data = JSON.parse(event.body);
    const id = data.id;
    const title = data.title;
    const body=data.body;


    var params = {
        TableName : TODO_TABLE_NAME,
        Item: { todoId : id, title: title,body:body }
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - todo added", data);
      } catch (err) {
        console.log("Error", err.stack);
      }

    const response = {
        statusCode: 200,
        body: JSON.stringify(data)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.data}`);
    return response;
};
