import "./loginView.css"
import { useState } from "react"
import logo from '../../assets/logo.svg'
import { useNavigate } from 'react-router'


type Mode = "login" | "register"

export function LoginPage() {
	const [mode, setMode ] = useState<Mode>("login")
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	

	return(
		<main className="login-page">
			<section className="login-card">
				<div className="logo">
					<div className="logo-box">
						<img src={logo} alt="Chappy logotyp" />
					<span>Chappy</span>
					</div>
				</div>

				<div>
					<h1>{mode === 'login' ? 'Välkommen tillbaka' : 'Skapa konto'}</h1>
					<p className="subtitle">
						Logga in för att chatta i låsta kanaler och skicka direktmeddelanden.
					</p>
				</div>

				<div className="tabs">
					<button
						className={mode === 'login' ? 'tab active' : 'tab'}
						onClick={() => setMode('login')}
					>Logga in</button>
					<button
						className={mode === 'register' ? 'tab active' : 'tab'}
						onClick={() => setMode('register')}
					>Registrera</button>
				</div>

				<form>
					<label>
						Användarnamn
						<input value={username} onChange={e => setUsername(e.target.value)} />
					</label>
					<label>
						Lösenord
						<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</label>

					

					<button type="submit" className="btn-primary">
						{mode === 'login' ? 'Logga in' : 'Registrera'}
					</button>
				</form>

				<button className="btn-secondary">
					Fortsätt som gäst
				</button>
			</section>

		</main>
	)
}