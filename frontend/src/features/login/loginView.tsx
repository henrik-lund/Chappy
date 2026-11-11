import "./loginView.css"
import { useState } from "react"
import type { SubmitEvent } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { loginSchema, registerSchema } from "shared"
import {useAuthStore} from "../../store/authStore"
import logo from "../../assets/logo.svg"

type Mode = "login" | "register"

export function LoginPage() {
	const [searchParams] = useSearchParams()
	const [mode, setMode] = useState<Mode>(
		searchParams.get("mode") === "register" ? "register" : "login"
	)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [info, setInfo] = useState("")
	const navigate = useNavigate()
	const login = useAuthStore(state => state.login)

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault()
		setError("")
		setInfo("")

		// Validera
		const schema = mode === "login" ? loginSchema : registerSchema
		const parsed = schema.safeParse({ username, password })
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter")
			return
		}

		// Skicka till backend
		const url = mode === "login" ? "/api/auth/login" : "/api/auth/register"

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(parsed.data)
			})
			const data = await response.json()

			if (!response.ok) {
				setError(data.error ?? "Något gick fel")
				return
			}

			if (mode === "register") {
				setInfo("Kontot är skapat! Logga in.")
				setMode("login")
				setPassword("")
			} else {
				login(data.user, data.token)
				navigate("/chat")
			}
		} catch {
			setError("Något gick fel. Försök igen.")
		}
	}

	return (
		<main className="login-page">
			<section className="login-card">
				<div className="logo">
					<div className="logo-box">
						<img src={logo} alt="Chappy logotyp" />
						<span>Chappy</span>
					</div>
				</div>

				<div>
					<h1>{mode === "login" ? "Välkommen tillbaka" : "Skapa konto"}</h1>
					<p className="subtitle">
						Logga in för att chatta i låsta kanaler och skicka direktmeddelanden.
					</p>
				</div>

				<div className="tabs">
					<button
						type="button"
						className={mode === "login" ? "tab active" : "tab"}
						onClick={() => setMode("login")}
					>Logga in</button>
					<button
						type="button"
						className={mode === "register" ? "tab active" : "tab"}
						onClick={() => setMode("register")}
					>Registrera</button>
				</div>

				<form onSubmit={handleSubmit}>
					<label>
						Användarnamn
						<input value={username} onChange={e => setUsername(e.target.value)} />
					</label>
					<label>
						Lösenord
						<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</label>

					{error && <p className="error">{error}</p>}
					{info && <p className="info">{info}</p>}
					<button type="submit" className="btn-primary">
						{mode === "login" ? "Logga in" : "Registrera"}
					</button>
				</form>

				<button type="button" className="btn-secondary" onClick={() => navigate("/chat")}>
					Fortsätt som gäst
				</button>
			</section>
		</main>
	)
}