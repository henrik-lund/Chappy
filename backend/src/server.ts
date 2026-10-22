import express from "express"
import { type Express } from "express"
import { getPort } from "./utils.js"
import { logger } from "./middleware.js"
import path from "node:path"
import userRouter from "./routes/users.js"

const app: Express = express()
const port: number = getPort()
const distPath: string = path.resolve(import.meta.dirname, "../../../frontend/dist")

app.use(express.static(distPath))
app.use("/", logger)

app.use("/api/users", userRouter)

app.listen(port, () =>{
	console.log(`Server is listening on port ${port}`)
})