import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { LambdaHandler, createResponse } from "./types";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: LambdaHandler = async (event) => {
  try {
    if (!event.pathParameters?.discId) {
      return createResponse(400, { message: "Missing disc ID" });
    }

    // In a real app, get userId from auth context
    const userId =
      event.requestContext.authorizer?.claims?.sub || "default-user";
    const { discId } = event.pathParameters;

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
        discId,
      },
    });

    await docClient.send(command);

    return createResponse(204, null);
  } catch (error) {
    console.error("Error removing disc:", error);
    return createResponse(500, { message: "Error removing disc" });
  }
};
