import { DynamoDB } from "aws-sdk";
import { LambdaHandler, createResponse } from "./types";

const dynamoDB = new DynamoDB.DocumentClient();
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

    await dynamoDB
      .delete({
        TableName: TABLE_NAME,
        Key: {
          userId,
          discId,
        },
      })
      .promise();

    return createResponse(204, null);
  } catch (error) {
    console.error("Error removing disc:", error);
    return createResponse(500, { message: "Error removing disc" });
  }
};
