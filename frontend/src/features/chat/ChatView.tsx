import { useEffect, useState } from "react"
import type { Channel, Message, User } from "shared"
import { Sidebar } from "./Sidebar"
import { ChannelHeader } from "./ChannelHeader"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"
import { useAuthStore } from "../../store/authStore"
import "./chat.css"

export function ChatView() {
	const [channels, setChannels] = useState<Channel[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [error, setError] = useState("")
	const user = useAuthStore(state => state.user)
	const token = useAuthStore(state => state.token)

	const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

	// 1. Hämta kanaler och användare, en gång
	useEffect(() => {
		async function fetchData() {
			const [channelRes, userRes] = await Promise.all([
				fetch("/api/channels"),
				fetch("/api/users")
			])
			const channelData: Channel[] = await channelRes.json()
			setChannels(channelData)
			setUsers(await userRes.json())
			setActiveChannel(channelData[0] ?? null)
		}
		fetchData()
	}, [])

	// 2. Hämta meddelanden varje gång kanalen eller inloggningen byts
	useEffect(() => {
		if (!activeChannel) return

		async function fetchMessages() {
			setError("")
			setMessages([])
			const response = await fetch(`/api/channels/${activeChannel!.channelId}/messages`, {
				headers: authHeader
			})
			const data = await response.json()

			if (!response.ok) {
				setError(data.error ?? "Kunde inte hämta meddelanden")
				return
			}
			setMessages(data)
		}
		fetchMessages()
	}, [activeChannel, token])

	// 3. Skicka meddelande
	async function handleSend(text: string) {
		if (!activeChannel) return

		const response = await fetch(`/api/channels/${activeChannel.channelId}/messages`, {
			method: "POST",
			headers: { "Content-Type": "application/json", ...authHeader },
			body: JSON.stringify({ text })
		})
		const data = await response.json()

		if (!response.ok) {
			setError(data.error ?? "Kunde inte skicka")
			return
		}
		setMessages(prev => [...prev, data])
	}

	return (
		<div className="chat-layout">
			<Sidebar
				channels={channels}
				users={users}
				activeChannelId={activeChannel?.channelId ?? ""}
				onSelectChannel={setActiveChannel}
			/>
			<main className="chat-main">
				{activeChannel ? (
					<>
						<ChannelHeader channel={activeChannel} />
						{error ? (
							<div className="locked-message">
								<p>🔒 {error}</p>
							</div>
						) : (
							<MessageList messages={messages} users={users} currentUserId={user?.userId ?? ""} />
						)}
						{!error && (
							<MessageInput
								placeholder={`Skriv ett meddelande i #${activeChannel.name}${user ? "" : " som gäst"}…`}
								onSend={handleSend}
							/>
						)}
					</>
				) : (
					<p className="loading">Laddar kanaler…</p>
				)}
			</main>
		</div>
	)
}