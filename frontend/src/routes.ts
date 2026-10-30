import type { RouteObject } from "react-router"
import LoginView from "./pages/LoginView"

const routerConfig: RouteObject[] = [
	{
		path: '/',  
		// Component: Root,
		children: [
			{
				path: '/',
				Component: LoginView
			},
			{
				
			}
		]
	}
]


export { routerConfig }