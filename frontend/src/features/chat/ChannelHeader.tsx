import type { Channel } from "shared"

type Props = { 
	channel: Channel
	onSummarize: () => void
	loading: boolean
}

export function ChannelHeader({ channel, onSummarize, loading }: Props) {
	return (
		<header className="channel-header">
			<div>
				<h1>{channel.isLocked ? "🔒" : "#"} {channel.name}</h1>
				<p>{channel.isLocked ? "Låst kanal · bara för inloggade" : "Öppen kanal · alla kan läsa och skriva"}</p>
			</div>
			<button className="btn-primary" onClick={onSummarize} disabled={loading}>{loading ? "Sammanfattar...": "✨ Sammanfatta"}</button>
		</header>
	)
}