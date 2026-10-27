import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getAwsConfig, getTableName } from "../utils.js";

const client = new DynamoDBClient(getAwsConfig())

export const db = DynamoDBDocumentClient.from(client)
export const tableName = getTableName()
