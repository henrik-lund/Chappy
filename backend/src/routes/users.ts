import express from "express"
import type {Router, Request, Response} from "express"
import { DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import {db, tableName} from "../data/dynamoDb.js"
import type { User } from "shared"
import { requireAuth } from "../middleware.js"

const router: Router = express.Router()

// GET /api/users
router.get("/", async (req, res) => {
	const result = await db.send(new QueryCommand ({
		TableName: tableName,
		KeyConditionExpression: "pk = :pk",
		ExpressionAttributeValues: {":pk": "USER"}
	}))

	const users: User[] = (result.Items ?? []).map(item => ({
		userId: item.userId,
		username: item.username
	}))
	res.send(users)
})

router.delete("/me", requireAuth, async (req: Request, res: Response) => {
	const myId: string = res.locals.user.userId

	await db.send(new DeleteCommand({
		TableName: tableName,
		Key: { pk: "USER", sk: `USER#${myId}` }
	}))
	res.status(204).end()
})


export default router
