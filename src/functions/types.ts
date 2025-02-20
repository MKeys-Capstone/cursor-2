import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export interface UserDisc {
  userId: string;
  discId: string;
  name: string;
  manufacturer: string;
  category: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  image?: string;
  condition: string;
  weight: number;
  notes?: string;
  inBag: boolean;
}

export type LambdaHandler = (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult>;

export const createResponse = (statusCode: number, body: any) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify(body),
});
