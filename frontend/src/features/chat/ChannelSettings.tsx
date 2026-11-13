import { useState } from "react";
import type { Channel } from "shared";

type Props = {
	channel: Channel
	onClose: () => void 
	onDelete: () => Promise <string | null>
}

export function ChannelSettings ({ channel, onClose, onDelete}: Props) {
	const [error , setError] = useState("")
	const [confirmDelete, setConfirmDelete] = useState(false)

	async function handleDelete() {
		const result = await onDelete()
		if (result) {
			setError(result)
			return
		}
		onClose()
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
				<div className="modal-head">
					<h2>Kanalinställningar</h2>
					<button className="modal-close" onClick={onClose} aria-label="Stäng">X</button>
				</div>

				<p className="modal-text">
					Du är skaparen av <strong>#{channel.name}</strong>
				</p>

				<div className="modal-section danger">
					{!confirmDelete ? (
						<>
							<p>Kanalen och alla dess meddelanden tas bort permanent.</p>
							<button className="btn-danger" onClick={() => setConfirmDelete(true)}>
								Ta bort kanal
							</button>
						</>
					) : (
						<>
							<p><strong>Är du säker?</strong> Det går inte att ångra.</p>
							<div className="modal-buttons">
								<button className="btn-secondary" onClick={() => setConfirmDelete(false)}>
									Avbryt
								</button>
								<button className="btn-danger-solid" onClick={handleDelete}>
									Ja, ta bort
								</button>
							</div>
						</>
					)}
				</div>
					{error && <p className="modal-error">{error}</p>}
			</div>
		</div>
	)
}