import type { RouteObject } from "react-router"
import LoginView from "./pages/LoginView"
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
			}
		]
	}
]


export { routerConfig }