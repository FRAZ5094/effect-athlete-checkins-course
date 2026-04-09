import { Effect } from "effect"

// Stage 2:
// - replace this with small Effect helpers
// - build one Effect.gen(...) program
// - print the success path
// - add a tagged error example with catchTag(...)
//
// Stage 4:
// - construct the in-memory repositories directly
// - create an athlete
// - create one or two check-ins
// - list the current in-memory data and print it
//
// Stage 5:
// - stop constructing repositories directly here
// - pull services from the context instead
// - let src/main.ts provide AppLive before running
export const program = Effect.sync(() => {
  console.log(
    "Starter program is running. Open docs/02-basic-effects.md next."
  )
})
