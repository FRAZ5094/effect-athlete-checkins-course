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

## What To Notice

- `Hono` is only doing transport work.
- The route builds and runs an `Effect`.
- `Schema` guards the boundary.
- Domain errors map cleanly into HTTP codes.

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

