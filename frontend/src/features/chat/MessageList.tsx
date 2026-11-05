import type { Message, User } from "shared"

type Props = {
	messages: Message[]
	users: User[]
	currentUserId: string
	sentIds: string[]
}

function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })
}

export function MessageList({ messages, users, currentUserId, sentIds }: Props) {
	return (
		<div className="message-list">
			{messages.map(message => {
				const sender = users.find(u => u.userId === message.senderId)
				const isOwn = message.senderId === currentUserId || sentIds.includes(message.messageId)

				return (
					<div key={message.messageId} className={isOwn ? "message own" : "message"}>
						<div className="message-meta">
							<strong>
								{isOwn ? "Du" : message.senderId === "guest" ? "Gäst" : sender?.username ?? "Okänd"}
							</strong>
							<span>{formatTime(message.createdAt)}</span>
						</div>
						<p className="bubble">{message.text}</p>
					</div>
				)
			})}
		</div>
	)
}