import express from "express"
import type { Router, Request, Response } from "express"
import { QueryCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import type { Channel, Message } from "shared"
import { messageSchema } from "shared"
import { db, tableName } from "../data/dynamoDb.js"

const router: Router = express.Router()

type ChannelParams = { channelId: string }

async function getChannel(channelId: string) {
	const result = await db.send(new GetCommand({
		TableName: tableName,
		Key: { pk: "CHANNEL", sk: `CHANNEL#${channelId}` }
	}))
	return result.Item
}

// GET /api/channels
router.get("/", async (req: Request, res: Response) => {
	const result = await db.send(new QueryCommand({
		TableName: tableName,
		KeyConditionExpression: "pk = :pk",
		ExpressionAttributeValues: { ":pk": "CHANNEL" }
	}))

	const channels: Channel[] = (result.Items ?? []).map(item => ({
		channelId: item.channelId,
		name: item.name,
		isLocked: item.isLocked,
		creatorId: item.creatorId
	}))
	res.send(channels)
})

// GET /api/channels/:channelId/messages
router.get("/:channelId/messages", async (req: Request<ChannelParams>, res: Response) => {
	const { channelId } = req.params

	const channel = await getChannel(channelId)
	if (!channel) {
		res.status(404).send({ error: "Kanalen finns inte" })
		return
	}
	if (channel.isLocked && !res.locals.user) {
		res.status(401).send({ error: "Logga in för att läsa den här kanalen" })
		return
	}

	const result = await db.send(new QueryCommand({
		TableName: tableName,
		KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
		ExpressionAttributeValues: { ":pk": `CHANNEL#${channelId}`, ":prefix": "MSG#" }
	}))

	const messages: Message[] = (result.Items ?? []).map(item => ({
		messageId: item.messageId,
		senderId: item.senderId,
		text: item.text,
		createdAt: item.createdAt
	}))
	res.send(messages)
})

// POST /api/channels/:channelId/messages
router.post("/:channelId/messages", async (req: Request<ChannelParams>, res: Response) => {
	const { channelId } = req.params

	const parsed = messageSchema.safeParse(req.body)
	if (!parsed.success) {
		res.status(400).send({ error: parsed.error.issues[0]?.message })
		return
	}

	const channel = await getChannel(channelId)
	if (!channel) {
		res.status(404).send({ error: "Kanalen finns inte" })
		return
	}
	if (channel.isLocked && !res.locals.user) {
		res.status(401).send({ error: "Logga in för att skriva i den här kanalen" })
		return
	}

	const message: Message = {
		messageId: crypto.randomUUID(),
		senderId: res.locals.user?.userId ?? "guest",
		text: parsed.data.text,
		createdAt: new Date().toISOString()
	}

	await db.send(new PutCommand({
		TableName: tableName,
		Item: {
			pk: `CHANNEL#${channelId}`,
			sk: `MSG#${message.createdAt}#${message.messageId}`,
			...message
		}
	}))

	res.status(201).send(message)
})

export default router