# Stage 5: HTTP And Schema

Goal: keep the HTTP layer thin, decode request input with `Schema`, and map errors to HTTP responses.

## Before You Start

Install Postman if you do not already have it. You will use it to hit the endpoints manually.

## Files To Edit

- `src/domain/Athlete.ts`
- `src/domain/CheckIn.ts`
- `src/http/routes/athletes.ts`

## What To Build

### 1. Add Schemas

In [src/domain/Athlete.ts](/Users/fraser/Github/effect-learning/src/domain/Athlete.ts):

- add a `CreateAthleteInputSchema`
- use `Schema.NonEmptyTrimmedString` for `name`

In [src/domain/CheckIn.ts](/Users/fraser/Github/effect-learning/src/domain/CheckIn.ts):

- add a `CreateCheckInInputSchema`
- keep `bodyweightKg` optional/nullable
- keep `notes` optional/nullable
- require `energy` to be between `0` and `10`

This stage focuses on the boundary between raw HTTP input and typed application code.
`Hono` receives the request, `Schema` decodes unknown data, services handle the business logic, and the route maps the result back to HTTP.

## Read The Real Files In This Order

1. [src/domain/Athlete.ts](/Users/fraser/Github/effect-learning/src/domain/Athlete.ts)
2. [src/domain/CheckIn.ts](/Users/fraser/Github/effect-learning/src/domain/CheckIn.ts)
3. [src/application/AppLive.ts](/Users/fraser/Github/effect-learning/src/application/AppLive.ts)
4. [src/http/routes/athletes.ts](/Users/fraser/Github/effect-learning/src/http/routes/athletes.ts)

## Example 1: Schema At The Boundary

Imagine a books API:

```ts
import { Schema } from "effect"

const CreateBookInputSchema = Schema.Struct({
  title: Schema.NonEmptyTrimmedString
})
```

Then in the route:

```ts
const body = await context.req.json()

const program = Effect.gen(function* () {
  const input = yield* Schema.decodeUnknown(CreateBookInputSchema)(body)
  const bookService = yield* BookService
  return yield* bookService.createBook(input)
})
```

What matters:

- `req.json()` gives you unknown runtime data
- `Schema.decodeUnknown(...)` gives you typed input
- the service receives trusted data

## Example 2: Route Handlers Should Stay Thin

A thin route handler looks like this:

```ts
books.post("/", async (context) => {
  const body = await context.req.json()

  const program = Effect.gen(function* () {
    const input = yield* Schema.decodeUnknown(CreateBookInputSchema)(body)
    const bookService = yield* BookService
    return yield* bookService.createBook(input)
  })

  const exit = await Effect.runPromiseExit(
    Effect.provide(program, AppLive)
  )

  // map the exit to an HTTP response here
})
```

The route does transport and mapping work.
It does not implement duplicate checks, not-found logic, or persistence.

## Example 3: Mapping Tagged Errors

Non-answer example:

```ts
if (Cause.isFailType(cause)) {
  const error = cause.error

  if (error._tag === "BookNotFound") {
    return context.json({ message: "Book not found" }, 404)
  }

  if (error._tag === "DuplicateBookTitle") {
    return context.json({ message: "Duplicate title" }, 409)
  }
}
```

The important idea is not the exact helper you use.
The important idea is:

- schema errors become `400`
- tagged domain errors become prescribed HTTP codes
- unknown failures become `500`

## Example 4: Range Validation In Schema

A non-answer example for a rating field:

```ts
const CreateReviewInputSchema = Schema.Struct({
  rating: pipe(
    Schema.Number,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(5)
  ),
  text: Schema.NullOr(Schema.String)
})
```

That is the same idea you need for `energy`, except your range is `0` to `10`.

## Example 5: Optional And Nullable Fields

Another non-answer example:

```ts
const PatchProfileSchema = Schema.Struct({
  bio: Schema.optional(Schema.NullOr(Schema.String))
})
```

That is the kind of shape you want for fields like:

- `bodyweightKg`
- `notes`

## One Route Mental Model

Every route in this stage should feel like a variation of the same recipe:

```ts
read HTTP input
  -> decode it
  -> call a service
  -> provide AppLive
  -> run the effect
  -> map success or failure to an HTTP response
```

If your route is doing more than that, it is probably taking on too much responsibility.

### 2. Finish The Route Handlers

In [src/http/routes/athletes.ts](/Users/fraser/Github/effect-learning/src/http/routes/athletes.ts), implement these routes:

- `POST /athletes`
- `GET /athletes/:id`
- `POST /athletes/:id/check-ins`
- `GET /athletes/:id/check-ins`

Each handler should:

1. Read params and/or JSON from `Hono`
2. Build an `Effect` program
3. Decode unknown input with `Schema.decodeUnknown(...)`
4. Call the service
5. Provide `AppLive`
6. Run the effect
7. Map known errors to plain JSON responses

## What You Should Literally Write

In [src/domain/Athlete.ts](/Users/fraser/Github/effect-learning/src/domain/Athlete.ts):

1. Import `Schema`.
2. Export `CreateAthleteInputSchema`.
3. Make `name` a `Schema.NonEmptyTrimmedString`.

In [src/domain/CheckIn.ts](/Users/fraser/Github/effect-learning/src/domain/CheckIn.ts):

1. Import `Schema` and `pipe`.
2. Export `CreateCheckInInputSchema`.
3. Make `energy` a number constrained to `0` through `10`.
4. Make `bodyweightKg` optional/nullable.
5. Make `notes` optional/nullable.

In [src/http/routes/athletes.ts](/Users/fraser/Github/effect-learning/src/http/routes/athletes.ts):

1. Read params and/or `await context.req.json()`.
2. Build an `Effect.gen(...)` program.
3. Decode request bodies with `Schema.decodeUnknown(...)`.
4. Pull the correct service from the context.
5. Call the service.
6. Provide `AppLive`.
7. Run the effect.
8. Turn schema/domain/unexpected failures into the prescribed response codes.

## Expected Outcome

By the end of this stage, you should be able to:

- explain how Hono hands control to the application
- explain how Schema turns raw input into trusted data
- explain why the service layer stays free of HTTP concerns
- explain how the route translates between HTTP and the service layer

### 3. Prescribed Status Codes

Successful responses:

- all success responses should return `200`

Known failures:

- schema decode failure -> `400`
- `AthleteNotFound` -> `404`
- `DuplicateAthleteName` -> `409`
- `AthleteCheckInLimitReached` -> `409`
- unknown/unexpected failure -> `500`

### 4. Prescribed Response Shapes

- `POST /athletes` -> the created athlete object
- `GET /athletes/:id` -> the athlete object
- `POST /athletes/:id/check-ins` -> the created check-in object
- `GET /athletes/:id/check-ins` -> an array of check-ins

## Manual Postman Checks

Work through these in order:

1. `POST /athletes` with `{ "name": "Adrian" }`
2. Repeat the same request and confirm you get `409`
3. `GET /athletes/:id` with the created athlete id
4. `POST /athletes/:id/check-ins` with:

```json
{
  "energy": 7,
  "bodyweightKg": 92.3,
  "notes": "Felt strong"
}
```

5. `GET /athletes/:id/check-ins`
6. Send a bad check-in with `energy: 11` and confirm you get a schema-driven `400`

If something is failing, debug in this order:

1. Did the request body shape match the schema?
2. Did the route decode the body before calling the service?
3. Did the route provide `AppLive` before running the effect?
4. Is the failure a schema failure, a domain error, or an unexpected defect?

## What To Notice

- `Hono` is only doing transport work.
- The route builds and runs an `Effect`.
- `Schema` guards the boundary.
- Domain errors map cleanly into HTTP codes.
- The service layer does not know anything about HTTP response objects.

## Checkpoint

- All four routes work.
- Validation errors return `400`.
- Known domain errors return the prescribed status codes.
- Successful responses return plain JSON with status `200`.

## Questions

- Why should the service receive typed input instead of raw `unknown`?
- What does the HTTP layer know that the service layer should not know?

## Common Mistake

- Letting route handlers grow business logic branches instead of mapping errors and delegating to services.

## If You Need Help

If you get stuck here, ask Claude or GPT narrowly about the route you are working on.

Useful questions:

- "Can you explain the order of operations for this route?"
- "Can you help me understand where `Schema.decodeUnknown(...)` should happen?"
- "Can you review my error mapping without rewriting the whole route?"

If the issue is specifically `Hono` wiring or `Effect` integration with `Hono`, ask it to fix that part directly. That is not the main learning goal.
