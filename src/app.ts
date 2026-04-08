import { Hono } from "hono"
import { athleteRoutes } from "./http/routes/athletes.js"

export const app = new Hono()

app.get("/", (context) => {
  return context.text("Hello World")
})

app.route("/athletes", athleteRoutes)

