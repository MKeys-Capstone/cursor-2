import { DynamoDB } from "aws-sdk";
import { LambdaHandler, createResponse, UserDisc } from "./types";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: LambdaHandler = async (event) => {
  try {
    if (!event.body) {
      return createResponse(400, { message: "Missing disc data" });
    }

    // In a real app, get userId from auth context
    const userId =
      event.requestContext.authorizer?.claims?.sub || "default-user";
    const discData = JSON.parse(event.body) as Omit<
      UserDisc,
      "userId" | "discId"
    >;

    const disc: UserDisc = {
      userId,
      discId: uuidv4(),
      ...discData,
    };

    await dynamoDB
      .put({
        TableName: TABLE_NAME,
        Item: disc,
      })
      .promise();

    return createResponse(201, disc);
  } catch (error) {
    console.error("Error adding disc:", error);
    return createResponse(500, { message: "Error adding disc" });
  }
};
