import { Hono } from "hono"

export const athleteRoutes = new Hono()

athleteRoutes.post("/", async (context) => {
  // TODO in docs/05-http-and-schema.md:
  // 1. Read the request body.
  // 2. Decode it with Effect Schema.
  // 3. Call AthleteService.createAthlete.
  // 4. Map schema and domain errors to HTTP responses.
  return context.json({ message: "Not implemented yet" }, 501)
})

athleteRoutes.get("/:id", async (context) => {
  // TODO in docs/05-http-and-schema.md:
  // 1. Read the id from the route params.
  // 2. Call AthleteService.getAthlete.
  // 3. Map domain errors to HTTP responses.
  return context.json({ message: "Not implemented yet" }, 501)
})

athleteRoutes.post("/:id/check-ins", async (context) => {
  // TODO in docs/05-http-and-schema.md:
  // 1. Read the athlete id and request body.
  // 2. Decode the body with Effect Schema.
  // 3. Call CheckInService.recordCheckIn.
  // 4. Map schema and domain errors to HTTP responses.
  return context.json({ message: "Not implemented yet" }, 501)
})

athleteRoutes.get("/:id/check-ins", async (context) => {
  // TODO in docs/05-http-and-schema.md:
  // 1. Read the athlete id from the route params.
  // 2. Call CheckInService.listCheckIns.
  // 3. Map domain errors to HTTP responses.
  return context.json({ message: "Not implemented yet" }, 501)
})

