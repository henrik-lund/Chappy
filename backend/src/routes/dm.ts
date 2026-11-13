import express from "express"
import type { Router, Request, Response } from "express"
import { PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
import type {Message} from "shared"
import {messageSchema} from "shared"
import { db, tableName } from "../data/dynamoDb.js"
import { requireAuth } from "../middleware.js"

const router: Router = express.Router()

type DmParams = { dmId: string}

router.use(requireAuth)

function getDmKey(userA: string, userB: string): string {
	return "DM#" + [userA, userB].sort().join("#")
}

router.get("/:dmId", async (req: Request<DmParams>, res: Response) => {
	const myId: string = res.locals.user.userId
	const dmKey = getDmKey(myId, req.params.dmId)

	const result = await db.send(new QueryCommand ({
		TableName: tableName,
		KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
		ExpressionAttributeValues: { ":pk": dmKey, ":prefix": "MSG#" }
	}))

	const messages: Message[] = (result.Items ?? []).map(item => ({
		messageId: item.messageId,
		senderId: item.senderId,
		text: item.text,
		createdAt: item.createdAt
	}))
	res.send(messages)
})

router.post("/:dmId", async (req: Request<DmParams>, res: Response) => {
	const myId: string = res.locals.user.userId
	const {dmId} = req.params

	const parsed = messageSchema.safeParse(req.body)
	if(!parsed.success) {
		res.status(400).send({ error: parsed.error.issues[0]?.message})
		return
	}

	const receiver = await db.send(new GetCommand({
		TableName: tableName,
		Key: { pk: "USER", sk: `USER#${dmId}`}
	}))
	if (!receiver.Item){
		res.status(404).send({ error: "Användaren finns inte"})
		return
	}

	const message: Message = {
		messageId: crypto.randomUUID(),
		senderId: myId,
		text: parsed.data.text,
		createdAt: new Date().toISOString()
	}

	await db.send(new PutCommand({
		TableName: tableName,
		Item: {
			pk: getDmKey(myId, dmId),
			sk: `MSG#${message.createdAt}#${message.messageId}`,
			...message
		}
	}))
	res.status(201).send(message)
})

export default router