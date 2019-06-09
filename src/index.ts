#!/usr/bin/env node
import debug from "debug"
import http from "http"
import * as dotenv from "dotenv"
import app from "./app"
import ErrnoException = NodeJS.ErrnoException
import mongoose from "mongoose"

const debugLog = debug("api:server")

dotenv.config()

const port = normalizePort(process.env.PORT || "3000")
app.set("port", port)

mongoose.Promise = Promise
mongoose
  .connect(process.env.MONGO_URI, {
    // https://mongoosejs.com/docs/deprecations.html
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    const server = http.createServer(app)

    server.listen(port)
    server.on("error", onError)
    server.on("listening", onListening)

    function onListening() {
      const addr = server.address()
      const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port
      debugLog("Listening on " + bind)
    }
  })
  .catch(err => {
    console.error("App starting error:", err.stack)
    process.exit(1)
  })

function normalizePort(val: string): string | boolean | number {
  const portNumber = parseInt(val, 10)

  if (isNaN(portNumber)) {
    // named pipe
    return val
  }

  if (portNumber >= 0) {
    // port number
    return portNumber
  }

  return false
}

function onError(error: ErrnoException) {
  if (error.syscall !== "listen") {
    throw error
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // tslint:disable-next-line:no-console
      console.error(bind + " requires elevated privileges")
      process.exit(1)
      break
    case "EADDRINUSE":
      // tslint:disable-next-line:no-console
      console.error(bind + " is already in use")
      process.exit(1)
      break
    default:
      throw error
  }
}
