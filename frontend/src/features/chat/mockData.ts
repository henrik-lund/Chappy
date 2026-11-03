import type { Channel, Message, User } from "shared"

export const mockUsers: User[] = [
	{ userId: "u1", username: "Henrik" },
	{ userId: "u2", username: "MunterMoa" },
	{ userId: "u3", username: "GladaGustav" }
]

export const mockChannels: Channel[] = [
	{ channelId: "c1", name: "koda", isLocked: false, creatorId: "u2" },
	{ channelId: "c2", name: "random", isLocked: false, creatorId: "u3" },
	{ channelId: "c3", name: "grupp1", isLocked: true, creatorId: "u1" }
]

export const mockMessages: Message[] = [
	{ messageId: "m1", senderId: "u2", text: "Har någon kommit igång med DynamoDB?", createdAt: "2026-11-03T17:42:00Z" },
	{ messageId: "m2", senderId: "u3", text: "Ja, jag kör single table design!", createdAt: "2026-11-03T17:44:00Z" },
	{ messageId: "m3", senderId: "u1", text: "Smart! Code review imorgon?", createdAt: "2026-11-03T17:46:00Z" }
]