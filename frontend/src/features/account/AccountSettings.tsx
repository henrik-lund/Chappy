import { useState } from "react"

type Props = {
	username: string
	onClose: () => void
	onDelete: () => Promise<string | null>
}

function TrashIcon({ size = 18 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path d="M3 6h18" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
			<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
		</svg>
	)
}

export function AccountSettings({ username, onClose, onDelete }: Props) {
	const [error, setError] = useState("")
	const [confirmDelete, setConfirmDelete] = useState(false)

	async function handleDelete() {
		const result = await onDelete()
		if (result) {
			setError(result)
		}
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="account-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
				<div className="account-head">
					<div>
						<h2>Kontoinställningar</h2>
						<p>Inloggad som {username}</p>
					</div>
					<button className="account-close" onClick={onClose} aria-label="Stäng">×</button>
				</div>

				<div className="account-danger">
					<div className="account-danger-top">
						<span className="account-danger-icon">
							<TrashIcon size={20} />
						</span>
						<div>
							<h3>Ta bort konto</h3>
							<p>
								{confirmDelete
									? "Är du säker? Ditt konto raderas permanent och det går inte att ångra."
									: "Ditt konto raderas permanent. Det går inte att ångra."}
							</p>
						</div>
					</div>

					<div className="account-actions">
						{!confirmDelete ? (
							<button className="account-delete-btn" onClick={() => setConfirmDelete(true)}>
								<TrashIcon />
								Ta bort mitt konto
							</button>
						) : (
							<>
								<button className="account-cancel-btn" onClick={() => setConfirmDelete(false)}>
									Avbryt
								</button>
								<button className="account-delete-btn" onClick={handleDelete}>
									<TrashIcon />
									Ja, ta bort
								</button>
							</>
						)}
					</div>

					{error && <p className="account-error">{error}</p>}
				</div>
			</div>
		</div>
	)
}