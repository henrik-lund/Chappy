import type { Channel } from "shared"

type Props = { channel: Channel }

export function ChannelHeader({ channel }: Props) {
	return (
		<header className="channel-header">
			<div>
				<h1>{channel.isLocked ? "🔒" : "#"} {channel.name}</h1>
				<p>{channel.isLocked ? "Låst kanal · bara för inloggade" : "Öppen kanal · alla kan läsa och skriva"}</p>
			</div>
			<button className="btn-primary">✨ Sammanfatta</button>
		</header>
	)
}