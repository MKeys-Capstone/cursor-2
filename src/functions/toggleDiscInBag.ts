import { DynamoDB } from "aws-sdk";
import { LambdaHandler, createResponse } from "./types";

const dynamoDB = new DynamoDB.DocumentClient();
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

    const params = {
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
    };

    const result = await dynamoDB.update(params).promise();
    return createResponse(200, result.Attributes);
  } catch (error) {
    console.error("Error toggling disc bag status:", error);
    return createResponse(500, { message: "Error toggling disc bag status" });
  }
};
