import type { RouteObject } from "react-router"
import LoginView from "./pages/LoginView"
import { ChatView } from "./features/chat/ChatView"
import App from "./App"

const routerConfig: RouteObject[] = [
	{
		path: '/',  
		Component: App,
		children: [
			{
				path: '/',
				Component: LoginView
			},
			{
				path: "login",
				Component: LoginView
			},
			{
				path: "chat",
				Component: ChatView
			}
		]
	}
]


export { routerConfig }