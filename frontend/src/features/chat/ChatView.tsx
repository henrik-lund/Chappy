import { useEffect, useState } from "react"
import type { Channel, Message, User } from "shared"
import { Sidebar } from "./Sidebar"
import { ChannelHeader } from "./ChannelHeader"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"
import { useAuthStore } from "../../store/authStore"
import "./chat.css"

export type Conversation =
	| { type: "channel"; channel: Channel }
	| { type: "dm"; user: User }

function getMessagesUrl(conversation: Conversation): string {
	return conversation.type === "channel"
		? `/api/channels/${conversation.channel.channelId}/messages`
		: `/api/dm/${conversation.user.userId}`
}

export function ChatView() {
	const [channels, setChannels] = useState<Channel[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [active, setActive] = useState<Conversation | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [error, setError] = useState("")
	const [sentIds, setSentIds] = useState<string[]>([])
	const [summary, setSummary] = useState("")
	const [summaryLoading, setSummaryLoading] = useState(false)
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
			if (channelData[0]) {
				setActive({ type: "channel", channel: channelData[0] })
			}
		}
		fetchData()
	}, [])

	// 2. Hämta meddelanden när konversationen eller inloggningen ändras
	useEffect(() => {
		if (!active) return

		async function fetchMessages() {
			setError("")
			setSummary("")
			setMessages([])
			const response = await fetch(getMessagesUrl(active!), { headers: authHeader })
			const data = await response.json()

			if (!response.ok) {
				setError(data.error ?? "Kunde inte hämta meddelanden")
				return
			}
			setMessages(data)
		}
		fetchMessages()
	}, [active, token])

	// 3. Skicka meddelande
	async function handleSend(text: string) {
		if (!active) return

		const response = await fetch(getMessagesUrl(active), {
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
		setSentIds(prev => [...prev, data.messageId])
	}

	// 4. AI-sammanfattning
	async function handleSummarize() {
		if (active?.type !== "channel") return
		setSummaryLoading(true)

		try {
			const response = await fetch(`/api/channels/${active.channel.channelId}/summary`, {
				headers: authHeader
			})
			const data = await response.json()
			setSummary(response.ok ? data.summary : data.error ?? "Något gick fel")
		} catch {
			setSummary("Kunde inte nå servern")
		} finally {
			setSummaryLoading(false)
		}
	}

	// Text i skrivfältet
	const placeholder = !active
		? ""
		: active.type === "channel"
			? `Skriv ett meddelande i #${active.channel.name}${user ? "" : " som gäst"}…`
			: `Skriv till ${active.user.username}…`

	return (
		<div className="chat-layout">
			<Sidebar
				channels={channels}
				users={users}
				active={active}
				onSelect={setActive}
			/>
			<main className="chat-main">
				{active ? (
					<>
						{active.type === "channel" ? (
							<>
								<ChannelHeader
									channel={active.channel}
									onSummarize={handleSummarize}
									loading={summaryLoading}
								/>
								{summary && (
									<div className="summary-card">
										<div className="summary-head">
											<strong>✨ AI-sammanfattning</strong>
											<button onClick={() => setSummary("")} aria-label="Stäng">x</button>
										</div>
										<p>{summary}</p>
										<span>Genererad av Gemini</span>
									</div>
								)}
							</>
						) : (
							<header className="channel-header">
								<div>
									<h1>{active.user.username}</h1>
									<p>Direktmeddelande · bara ni två ser detta</p>
								</div>
							</header>
						)}

						{error ? (
							<div className="locked-message">
								<p>🔒 {error}</p>
							</div>
						) : (
							<>
								<MessageList
									messages={messages}
									users={users}
									currentUserId={user?.userId ?? ""}
									sentIds={sentIds}
								/>
								<MessageInput placeholder={placeholder} onSend={handleSend} />
							</>
						)}
					</>
				) : (
					<p className="loading">Laddar…</p>
				)}
			</main>
		</div>
	)
}