# Stage 2: Basic Effects

Goal: get comfortable writing and running one small Effect program before you touch repositories or services.

## Files To Edit

- `src/program.ts`

## Files To Read

- `src/main.ts`

## What To Build

Replace the starter program with a tiny terminal program that shows four basic ideas:

1. a function that returns `Effect.succeed(...)`
2. a function that returns an effect that prints something
3. an `Effect.gen(...)` program that sequences those effects
4. a tagged error path that you handle with `Effect.catchTag(...)`

Use a dice-style example.

The intended flow is:

1. print a welcome line
2. roll a random number
3. fail with a tagged error about half the time
4. catch that tagged error and print a friendly message
5. run the same program again and observe both paths over time

## Read The Real Files In This Order

1. [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts)
2. [src/program.ts](/Users/fraser/Github/effect-learning/src/program.ts)

## Example 1: A Tiny Success Effect

```ts
const getMessage = (): Effect.Effect<string> =>
  Effect.succeed("Hello from Effect")
```

That is just a value wrapped in an effect.

## Example 2: A Tiny Print Effect

```ts
const printLine = (message: string): Effect.Effect<void> =>
  Effect.sync(() => {
    console.log(message)
  })
```

This is useful because it shows that even simple side effects can be described as an `Effect`.

## Example 3: A Generator Program

```ts
const program = Effect.gen(function* () {
  const message = yield* getMessage()
  yield* printLine(message)
})
```

That is the basic pattern for this repo:

- write small effects
- combine them in one generator

## Example 4: A Tagged Error

```ts
class RollTooLow extends Data.TaggedError("RollTooLow")<{
  readonly roll: number
}> {}
```

Then later:

```ts
if (roll <= 3) {
  return yield* Effect.fail(new RollTooLow({ roll }))
}
```

## Example 5: Handling That Error

```ts
program.pipe(
  Effect.catchTag("RollTooLow", (error) =>
    printLine(`Bad luck. You rolled ${error.roll}.`)
  )
)
```

That is the exact pattern you should practice here.

## What You Should Literally Write

In [src/program.ts](/Users/fraser/Github/effect-learning/src/program.ts):

1. Add one small helper that returns `Effect.Effect<string>`.
2. Add one small helper that prints a line.
3. Add a tagged error class for the failed roll case.
4. Add one effect that rolls a random number.
5. Fail when the roll is in the lower half.
6. Build one `Effect.gen(...)` program that prints both the normal path and the handled error path.

Recommended function shapes:

- `getWelcomeMessage(): Effect.Effect<string>`
- `printLine(message: string): Effect.Effect<void>`
- `rollDie(): Effect.Effect<number>`
- `rollForOutcome(): Effect.Effect<string, RollTooLow>`

You can rename them if you prefer, but keep the ideas the same.

## Expected Outcome

By the end of this stage, you should be able to explain:

- the difference between building an effect and running it
- what `yield*` is doing inside `Effect.gen(...)`
- why a tagged error is easier to match than a thrown exception
- why `src/main.ts` stays tiny

## Checkpoint

- `npm run dev` runs your program
- you can see the success path sometimes
- you can see the handled tagged error path sometimes
- all of the logic lives in `src/program.ts`

## Questions

- Which function is just wrapping a plain value?
- Which function is describing a side effect?
- Where does the tagged error get turned into a printed message?

## Manual Verification

Run `npm run dev` several times.

You should eventually see both:

- the success path
- the handled tagged error path

## Common Mistake

- throwing an exception instead of using `Effect.fail(...)`

## If You Need Help

Ask a narrow question:

- "I understand `Effect.succeed`, but I do not understand what `yield*` gives back."
- "Can you review just the tagged error part in `src/program.ts`?"
- "Can you explain why `catchTag` belongs after the failing effect?"
