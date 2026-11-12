import type { Channel } from "shared"
import { useAuthStore } from "../../store/authStore"
import settingsIcon from "../../assets/settings.svg"

type Props = { 
	channel: Channel
	onSummarize: () => void
	loading: boolean
	onOpenSettings: () => void 
}

export function ChannelHeader({ channel, onSummarize, loading, onOpenSettings }: Props) {

	const user = useAuthStore(state => state.user)

	const isCreator = user?.userId === channel.creatorId

	return (
		<header className="channel-header">
			<div>
				<h1>{channel.isLocked ? "🔒" : "#"} {channel.name}</h1>
				<p>{channel.isLocked ? "Låst kanal · bara för inloggade" : "Öppen kanal · alla kan läsa och skriva"}</p>
			</div>
			<div className="header-actions">
				{isCreator && (
					<button className="btn-settings" onClick={onOpenSettings}>
						<img src={settingsIcon} alt="" />
						Kanalinställningar
					</button>
				)}

				<button className="btn-primary" onClick={onSummarize} disabled={loading}>
					{loading ? "Sammanfattar…" : "✨ Sammanfatta"}
				</button>
			</div>
		</header>
	)
}