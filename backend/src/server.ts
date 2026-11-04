import express from "express"
import { type Express } from "express"
import { getPort } from "./utils.js"
import { logger, readUser } from "./middleware.js"
import path from "node:path"
import userRouter from "./routes/users.js"
import authRouter from "./routes/auth.js"
import channelRouter from "./routes/channels.js"



const app: Express = express()
const port: number = getPort()
const distPath: string = path.resolve(import.meta.dirname, "../../../../frontend/dist")
app.use(express.json())
app.use(express.static(distPath))
app.use("/", logger)
app.use("/", readUser)

app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/channels", channelRouter)


app.listen(port, () =>{
	console.log(`Server is listening on port ${port}`)
})
