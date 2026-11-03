import { useNavigate } from "react-router"
import type { Channel, User } from "shared"
import {useAuthStore} from "../../store/authStore"
import logo from "../../assets/logo.svg"

type Props = {
	channels: Channel[]
	users: User[]
	activeChannelId: string
	onSelectChannel: (channel: Channel) => void
}

export function Sidebar({ channels, users, activeChannelId, onSelectChannel }: Props) {
	const navigate = useNavigate()
	const user = useAuthStore(state => state.user)
	const logout = useAuthStore(state => state.logout)

	return (
		<aside className="sidebar">
			<div className="sidebar-top">
				<div className="sidebar-logo">
					<img src={logo} alt="Chappy logotyp" />
					<span>Chappy</span>
				</div>

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

			{user ? (
				<div className="user-card">
					<span className="avatar">{user.username.slice(0, 2).toUpperCase()}</span>
					<div className="user-info">
						<strong>{user.username}</strong>
						<span>● Inloggad</span>
					</div>
					<button className="logout-btn" onClick={() => {
						logout()
						navigate("/")
					}}>Logga ut</button>
				</div>
			) : (
				<div className="guest-card">
					<p>Du är gäst. Logga in för att läsa låsta kanaler och skicka DM.</p>
					<button className="guest-btn primary" onClick={() => navigate("/login")}>Logga in</button>
					<button className="guest-btn outline" onClick={() => navigate("/login?mode=register")}>Registrera konto</button>
				</div>
			)}
		</aside>
	)
}