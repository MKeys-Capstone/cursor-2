import { DynamoDB } from "aws-sdk";
import { LambdaHandler, createResponse, UserDisc } from "./types";

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: LambdaHandler = async (event) => {
  try {
    if (!event.body || !event.pathParameters?.discId) {
      return createResponse(400, { message: "Missing disc data or ID" });
    }

    // In a real app, get userId from auth context
    const userId =
      event.requestContext.authorizer?.claims?.sub || "default-user";
    const { discId } = event.pathParameters;
    const updates = JSON.parse(event.body) as Partial<UserDisc>;

    // Remove any attempts to update userId or discId
    delete updates.userId;
    delete updates.discId;

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId,
        discId,
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDB.update(params).promise();
    return createResponse(200, result.Attributes);
  } catch (error) {
    console.error("Error updating disc:", error);
    return createResponse(500, { message: "Error updating disc" });
  }
};
