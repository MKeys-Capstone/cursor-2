import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { createResponse, LambdaHandler } from "./types";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
// DynamoDB client
const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);

export const handler: LambdaHandler = async (event) => {
  try {
    console.log("event", event);
    const userId: any = "default-user";

    const params = {
      TableName: process.env.TABLE_NAME!,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const command = new QueryCommand(params);
    const result = await docClient.send(command);

    return createResponse(200, result.Items);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return createResponse(500, { message: "Error fetching collection" });
  }
};
