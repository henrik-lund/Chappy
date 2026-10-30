import * as z from "zod"

//---------------- Användare --------------

export const registerSchema = z.object ({
	username: z.string().trim().min(3, "Användarnamnet måste vara minst 3 tecken").max(20, "Användarnamnet får vara max 20 tecken."),
	password: z.string().min(8, "Lösenordet måste vara minst 8 tecken")
})

export const loginSchema = z.object({
	username: z.string().trim().min(1, "Ange ditt användarnamn"),
	password: z.string().min(1, "Ange ditt lösenord")
})

//---------------- Kanaler --------------

export const createChannelSchema = z.object ({
	name: z.string().trim().min(2, "Gruppnamnet måste vara minst 2 tecken.").max(20, "Gruppnamnet får vara max 20 tecken."),
	isLocked: z.boolean().default(false)
})

//---------------- Meddelanden --------------

export const messageSchema = z.object({
	text: z.string().trim().min(1, "Meddelandet får inte vara tomt").max(1000, "Meddalndet får vara max 1000 tecken")
})

//-------------------------------------------

export type RegisterBody = z.infer < typeof registerSchema >
export type LoginBody = z.input < typeof loginSchema >
export type CreateChannelBody = z.input < typeof createChannelSchema >
export type MessageBody = z.input < typeof messageSchema >

export type User = {
	userId: string
	username: string
}

export type Channel = {
	channelId: string
	name: string
	isLocked: boolean
	creatorId: string
}

export type Message = {
	messageId: string
	senderId: string
	text: string
	createdAt: string
}