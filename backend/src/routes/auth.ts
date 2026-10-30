import express from "express"
import type { Router, Request, Response } from "express"
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { registerSchema, loginSchema } from "shared"
import { db, tableName } from "../data/dynamoDb.js"
import { getJwtSecret } from "../utils.js"

const router: Router = express.Router()

async function findUserByName(username: string) {
	const result = await db.send(new QueryCommand({
		TableName: tableName,
		KeyConditionExpression: 'pk = :pk',
		FilterExpression: 'username = :username',
		ExpressionAttributeValues: { ':pk': 'USER', ':username': username }
	}))
	return result.Items?.[0]
}

// POST /api/auth/register

router.post("/register", async (req: Request, res: Response) => {
	const parsed = registerSchema.safeParse(req.body)
	if(!parsed.success) {
		res.status(400).send({ error: parsed.error.issues[0]?.message})
		return
	}

	const { username, password } = parsed.data

	if(await findUserByName(username)) {
		res.status(409).send({ error: "Användarenamnet är upptaget"})
		return
	}

	const userId = crypto.randomUUID()
	const passwordHash = await bcrypt.hash(password, 10)

	await db.send(new PutCommand ({
		TableName: tableName,
		Item: { pk: "USER", sk: `USER#${userId}`, userId, username, passwordHash }
	}))
	res.status(201).send({userId, username})
})

// POST /api/auth/login

router.post('/login', async (req: Request, res: Response) => {
	const parsed = loginSchema.safeParse(req.body)
	if (!parsed.success) {
		res.status(400).send({ error: parsed.error.issues[0]?.message })
		return
	}
	const { username, password } = parsed.data

	const user = await findUserByName(username)
	const passwordMatches = user && await bcrypt.compare(password, user.passwordHash)

	if (!passwordMatches) {
		res.status(401).send({ error: 'Fel användarnamn eller lösenord' })
		return
	}

	const token = jwt.sign(
		{ userId: user.userId, username: user.username },
		getJwtSecret(),
		{ expiresIn: '1h' }
	)

	res.send({ token, user: { userId: user.userId, username: user.username } })
})

export default router