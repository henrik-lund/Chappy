import express from "express"
import type {Router, Request, Response} from "express"
import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import {db, tableName} from "../data/dynamoDb.js"

const router: Router = express.Router()

// GET /api/users
router.get("/", async (req, res) => {
	const result = await db.send(new QueryCommand ({
		TableName: tableName,
		KeyConditionExpression: "pk = :pk",
		ExpressionAttributeValues: {":pk": "USER"}
	}))
	res.send(result.Items)
})

export default router