import express, { Application } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import logger from "morgan"
import path from "path"

import apolloServer from './apolloServer'

import indexRouter from "./routes"

const app: Application = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../static")))
app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: "*"
  })
)

app.use("/", indexRouter)

apolloServer.applyMiddleware({ app })

export default app
