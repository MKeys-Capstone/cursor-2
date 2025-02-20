import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

import { LambdaHandler, createResponse, UserDisc } from "./types";

const dynamoDB = new DynamoDBClient({});
const TABLE_NAME = process.env.TABLE_NAME!;

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
      discId: discData.name,
      ...discData,
    };

    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        userId: { S: disc.userId },
        discId: { S: disc.name },
        name: { S: disc.name },
        manufacturer: { S: disc.manufacturer },
        category: { S: disc.category },
        speed: { N: disc.speed.toString() },
        glide: { N: disc.glide.toString() },
        turn: { N: disc.turn.toString() },
        fade: { N: disc.fade.toString() },
        condition: { S: disc.condition },
        weight: { N: disc.weight.toString() },
        inBag: { BOOL: disc.inBag },
        ...(disc.image && { image: { S: disc.image } }),
        ...(disc.notes && { notes: { S: disc.notes } }),
      },
    });

    await dynamoDB.send(command);

    return createResponse(201, disc);
  } catch (error) {
    console.error("Error adding disc:", error);
    return createResponse(500, { message: "Error adding disc" });
  }
};
