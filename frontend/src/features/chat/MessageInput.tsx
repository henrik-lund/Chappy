import { useState } from "react"
import type { FormEvent } from "react"
import sendIcon from "../../assets/send.svg"

type Props = {
	placeholder: string
	onSend: (text: string) => void
}

export function MessageInput({ placeholder, onSend }: Props) {
	const [text, setText] = useState("")

	function handleSubmit(event: FormEvent) {
		event.preventDefault()
		if (!text.trim()) return
		onSend(text)
		setText("")
	}

	return (
		<form className="message-input" onSubmit={handleSubmit}>
			<input value={text} onChange={e => setText(e.target.value)} placeholder={placeholder} />
			<button type="submit" className="send-button">
				<img src={sendIcon} alt="Skicka" />
			</button>
		</form>
	)
} 