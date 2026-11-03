import { useNavigate } from "react-router"
import type { Channel, User } from "shared"

type Props = {
	channels: Channel[]
	users: User[]
	activeChannelId: string
	onSelectChannel: (channel: Channel) => void
}

export function Sidebar({ channels, users, activeChannelId, onSelectChannel }: Props) {
	const navigate = useNavigate()

	return (
		<aside className="sidebar">
			<div className="sidebar-top">
				<div className="sidebar-logo">Chappy</div>

				<section>
					<h2 className="sidebar-title">Kanaler</h2>
					{channels.map(channel => (
						<button
							key={channel.channelId}
							className={channel.channelId === activeChannelId ? "sidebar-item active" : "sidebar-item"}
							onClick={() => onSelectChannel(channel)}
						>
							<span className="sidebar-icon">{channel.isLocked ? "🔒" : "#"}</span>
							{channel.name}
						</button>
					))}
				</section>

				<section>
					<h2 className="sidebar-title">Direktmeddelanden</h2>
					{users.map(user => (
						<button key={user.userId} className="sidebar-item">
							<span className="avatar">{user.username.slice(0, 2).toUpperCase()}</span>
							{user.username}
						</button>
					))}
				</section>
			</div>

			<div className="guest-card">
				<p>Du är gäst. Logga in för att läsa låsta kanaler och skicka DM.</p>
				<button className="guest-btn primary" onClick={() => navigate("/login")}>
					Logga in
				</button>
				<button className="guest-btn outline" onClick={() => navigate("/login?mode=register")}>
					Registrera konto
				</button>
			</div>
		</aside>
	)
}