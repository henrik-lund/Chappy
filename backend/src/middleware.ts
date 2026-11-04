import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import {getJwtSecret} from "./utils.js"

export function formatTimestamp(date: Date = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, '0')
	const yyyy = date.getFullYear()
	const mm = pad(date.getMonth() + 1)
	const dd = pad(date.getDate())
	const hh = pad(date.getHours())
	const min = pad(date.getMinutes())
	const ss = pad(date.getSeconds())
	return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}


export const logger: RequestHandler = (req, res, next) => {
	const now = formatTimestamp()
	console.log(`${now}  ${req.method}  ${req.url}`)
	next()
}

type JwtPayload = {
	userId: string
	username: string
}

export const readUser: RequestHandler = (req, res, next) => {
	const header = req.headers.authorization

	if(header?.startsWith("Bearer ")) {
		const token = header.substring(7)
		try{
			const payload = jwt.verify(token, getJwtSecret()) as JwtPayload
			res.locals.user = { userId: payload.userId, username: payload.username}
		} catch (error) {
			console.error("Invalid token")
		}
	}
	next()
}

export const requireAuth: RequestHandler = (req, res, next) => {
	if (!res.locals.user) {
		res.status(401).send({ error: "Du måste vara inloggad" })
		return
	}
	next()
}