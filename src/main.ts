import { Effect } from "effect"
import { program } from "./program.js"

// Stage 5 will change this to provide AppLive before running the program.
void Effect.runPromise(program).catch((error) => {
  console.error("Program failed")
  console.error(error)
  process.exitCode = 1
})
