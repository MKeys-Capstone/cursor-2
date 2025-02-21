import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaHandler, createResponse, UserDisc } from "./types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;

// Generate a random string ID
const generateId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 21; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const handler: LambdaHandler = async (event) => {
  try {
    if (!event.body) {
      return createResponse(400, { message: "Missing disc data" });
    }

    // In a real app, get userId from auth context
    // const userId =
    //   event.requestContext.authorizer?.claims?.sub || "default-user";
    const userId = "default-user";
    const discData = JSON.parse(event.body) as Omit<
      UserDisc,
      "userId" | "discId"
    >;

    const disc: UserDisc = {
      userId,
      discId: generateId(),
      ...discData,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...disc,
        // Ensure optional fields are only included if they exist
        ...(disc.image && { image: disc.image }),
        ...(disc.notes && { notes: disc.notes }),
      },
    });

    await docClient.send(command);

    return createResponse(201, disc);
  } catch (error) {
    console.error("Error adding disc:", error);
    return createResponse(500, { message: "Error adding disc" });
  }
};
