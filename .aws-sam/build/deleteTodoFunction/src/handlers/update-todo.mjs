
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TODO_TABLE_NAME = process.env.TODO_TABLE_NAME;

export const updateTodo = async (event) => {
  if (event.httpMethod !== 'PUT') {
    throw new Error(`PutMethod only accept PUT method, you tried: ${event.httpMethod}`);
  }
  console.info('received:', event);
 
  const todoId = event.pathParameters.id;
  const data = JSON.parse(event.body);
  const title = data.title;
  const body=data.body;
  
  var params = {
    TableName : TODO_TABLE_NAME,
    Key: { todoId : todoId},
    UpdateExpression: "set title = :t, body = :b",
    ExpressionAttributeValues: {
        ":t": title,
        ":b": body,
    },
    ReturnValues: "UPDATED_NEW"
};

try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log("Success - todo updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
 
  const response = {
    statusCode: 200,
    body: JSON.stringify(data)
  };
 
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
