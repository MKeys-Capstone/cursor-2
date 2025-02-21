import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { LambdaHandler, createResponse } from "./types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: LambdaHandler = async (event) => {
  try {
    if (!event.body || !event.pathParameters?.discId) {
      return createResponse(400, { message: "Missing disc ID or bag status" });
    }

    // In a real app, get userId from auth context
    const userId =
      event.requestContext.authorizer?.claims?.sub || "default-user";
    const { discId } = event.pathParameters;
    const { inBag } = JSON.parse(event.body);

    if (typeof inBag !== "boolean") {
      return createResponse(400, { message: "Invalid bag status" });
    }

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
        discId,
      },
      UpdateExpression: "SET inBag = :inBag",
      ExpressionAttributeValues: {
        ":inBag": inBag,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return createResponse(200, result.Attributes);
  } catch (error) {
    console.error("Error toggling disc bag status:", error);
    return createResponse(500, { message: "Error toggling disc bag status" });
  }
};
