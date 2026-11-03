import { useState } from "react"
import type { Channel } from "shared"
import { Sidebar } from "./Sidebar"
import {ChannelHeader} from "./ChannelHeader"
import {MessageList} from "./MessageList"
import {MessageInput} from "./MessageInput"
import {mockChannels, mockMessages, mockUsers} from "./mockData"
import {useAuthStore} from "../../store/authStore"
import "./chat.css"

export function ChatView() { 
	const [activeChannel, setActiveChannel] = useState<Channel>(mockChannels[0]!)
	const user = useAuthStore(state => state.user)

	return (
		<div className="chat-layout">
			<Sidebar
				channels={mockChannels}
				users={mockUsers}
				activeChannelId={activeChannel.channelId}
				onSelectChannel={setActiveChannel}
			/>
			<main className="chat-main">
				<ChannelHeader channel={activeChannel} />
				<MessageList messages={mockMessages} users={mockUsers} currentUserId={user?.userId ?? ""} />
				<MessageInput 
					placeholder={`Skriv ett meddelande i #${activeChannel.name}${user ? "" : " som gäst"}…`}
					onSend={text => console.log("Skicka:", text)}
					/>
			</main>
		</div>
	)
}