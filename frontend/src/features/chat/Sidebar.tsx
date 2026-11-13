import { useNavigate } from "react-router"
import { useState } from "react"
import type { SubmitEvent } from "react"
import type { Channel, User } from "shared"
import { createChannelSchema } from "shared"
import type { Conversation } from "./ChatView"
import { useAuthStore } from "../../store/authStore"
import { AccountSettings } from "../account/AccountSettings" 
import logo from "../../assets/logo.svg"
import settings from "../../assets/settings.svg"
import logoutIcon from "../../assets/logout.svg"

type Props = {
	channels: Channel[]
	users: User[]
	active: Conversation | null
	onSelect: (conversation: Conversation) => void
	onCreateChannel: (name: string, isLocked: boolean) => Promise<string | null>
}

export function Sidebar({ channels, users, active, onSelect, onCreateChannel }: Props) {
	const navigate = useNavigate()
	const user = useAuthStore(state => state.user)
	const token = useAuthStore(state => state.token)   
	const logout = useAuthStore(state => state.logout)
	const [showForm, setShowForm] = useState(false)
	const [newName, setNewName] = useState("")
	const [newLocked, setNewLocked] = useState(false)
	const [formError, setFormError] = useState("")

	
	const [showAccount, setShowAccount] = useState(false)


	const otherUsers = users.filter(u => u.userId !== user?.userId)

	function handleLogout() {
		logout()
		navigate("/")
	}


	async function handleDeleteAccount(): Promise<string | null> {
		const response = await fetch("/api/users/me", {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` }
		})

		if (!response.ok) {
			const data = await response.json()
			return data.error ?? "Kunde inte ta bort kontot"
		}

		setShowAccount(false)
		logout()
		navigate("/")
		return null
	}

	async function handleCreate(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault()

		const parsed = createChannelSchema.safeParse({ name: newName, isLocked: newLocked })
		if (!parsed.success) {
			setFormError(parsed.error.issues[0]?.message ?? "Ogiltigt namn")
			return
		}

		const error = await onCreateChannel(parsed.data.name, parsed.data.isLocked)
		if (error) {
			setFormError(error)
			return
		}

		setNewName("")
		setNewLocked(false)
		setFormError("")
		setShowForm(false)
	}

	return (
		<aside className="sidebar">
			<div className="sidebar-top">
				<div className="sidebar-logo">
					<img src={logo} alt="Chappy logotyp" />
					<span>Chappy</span>
				</div>

				<section>
					<div className="sidebar-title-row">
						<h2 className="sidebar-title">Kanaler</h2>
						{user && (
							<button
								className="add-btn"
								onClick={() => setShowForm(!showForm)}
								aria-label="Skapa kanal"
							>
								{showForm ? "×" : "+"}
							</button>
						)}
					</div>

					{showForm && (
						<form className="create-channel" onSubmit={handleCreate}>
							<input
								className="create-channel-input"
								value={newName}
								onChange={e => setNewName(e.target.value)}
								placeholder="Kanalnamn"
								autoFocus
							/>
							<label>
								<input
									type="checkbox"
									checked={newLocked}
									onChange={e => setNewLocked(e.target.checked)}
								/>
								Låst kanal
							</label>
							{formError && <p className="form-error">{formError}</p>}
							<button type="submit">Skapa</button>
						</form>
					)}

					{channels.map(channel => {
						const isActive = active?.type === "channel" && active.channel.channelId === channel.channelId
						return (
							<button
								key={channel.channelId}
								className={isActive ? "sidebar-item active" : "sidebar-item"}
								onClick={() => onSelect({ type: "channel", channel })}
							>
								<span className="sidebar-icon">{channel.isLocked ? "🔒" : "#"}</span>
								{channel.name}
							</button>
						)
					})}
				</section>

				<section>
					<h2 className="sidebar-title">Direktmeddelanden</h2>
					{otherUsers.map(u => {
						const isActive = active?.type === "dm" && active.user.userId === u.userId
						return (
							<button
								key={u.userId}
								className={isActive ? "sidebar-item active" : "sidebar-item"}
								onClick={() => onSelect({ type: "dm", user: u })}
							>
								<span className="avatar">{u.username.slice(0, 2).toUpperCase()}</span>
								{u.username}
							</button>
						)
					})}
				</section>
			</div>

			{user ? (
				<>
					<div className="user-card">
						<span className="user-avatar">{user.username.slice(0, 2).toUpperCase()}</span>

						<div className="user-info">
							<strong>{user.username}</strong>
							<span><i className="online-dot" /> Inloggad</span>
						</div>

						<button className="icon-btn" onClick={() => setShowAccount(true)} aria-label="Kontoinställningar" title="Kontoinställningar">
							<img src={settings} alt="" />
						</button>

						<button className="icon-btn boxed" onClick={handleLogout} aria-label="Logga ut" title="Logga ut">
							<img src={logoutIcon} alt="" />
						</button>
					</div>

					{showAccount && (
						<AccountSettings
							username={user.username}
							onClose={() => setShowAccount(false)}
							onDelete={handleDeleteAccount}
						/>
					)}
				</>
			) : (
				<div className="guest-card">
					<p>Du är gäst. Logga in för att läsa låsta kanaler och skicka DM.</p>
					<button className="guest-btn primary" onClick={() => navigate("/login")}>
						Logga in
					</button>
					<button className="guest-btn outline" onClick={() => navigate("/login?mode=register")}>
						Registrera konto
					</button>
				</div>
			)}
		</aside>
	)
}