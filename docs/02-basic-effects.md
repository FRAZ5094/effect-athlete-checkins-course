# Stage 2: Basic Effects

Goal: get comfortable writing and running one small Effect program before you touch repositories or services.

## Files To Edit

- `src/main.ts`

## Files To Read

- `src/main.ts`

## What To Build

Start with one quick win first:

1. write the smallest possible effect that prints one line
2. run it with `Effect.runPromise(...)`
3. confirm you can see your own output in the terminal

Once that works, extend the same file into a slightly richer terminal program that shows four basic ideas:

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

## Quick Win: Your First Runnable Effect

Before you build the dice flow, get one tiny success on the screen:

```ts
const program = Effect.sync(() => {
  console.log("Hello from my first Effect program")
})

void Effect.runPromise(program)
```

That first print to the terminal is the quick win this stage should give you.

Once you see it work, keep the same file and refactor it into the fuller stage exercise.

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

## Example 4: `pipe(...)`

`pipe(...)` means "start with this value and apply helpers to it in order."

```ts
const handledProgram = program.pipe(
  Effect.catchTag("RollTooLow", (error) =>
    printLine(`Bad luck. You rolled ${error.roll}.`)
  )
)
```

Read that as:

1. start with `program`
2. attach a tagged-error handler
3. get back the handled program you will run

This is a small thing, but it shows up everywhere in Effect code.

## Example 5: A Tagged Error

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

## Example 6: Handling That Error

```ts
program.pipe(
  Effect.catchTag("RollTooLow", (error) =>
    printLine(`Bad luck. You rolled ${error.roll}.`)
  )
)
```

That is the exact pattern you should practice here.

## What You Should Literally Write

In [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts):

1. First, make the smallest possible effect that prints one line and run it.
2. Then refactor that file into helpers instead of leaving everything inline.
3. Add one small helper that returns `Effect.Effect<string>`.
4. Add one small helper that prints a line.
5. Add a tagged error class for the failed roll case.
6. Add one effect that rolls a random number.
7. Fail when the roll is in the lower half.
8. Build one `Effect.gen(...)` program that prints both the normal path and the handled error path.
9. Use `pipe(...)` or `.pipe(...)` when you attach `Effect.catchTag(...)`.

Recommended function shapes:

- `getWelcomeMessage(): Effect.Effect<string>`
- `printLine(message: string): Effect.Effect<void>`
- `rollDie(): Effect.Effect<number>`
- `rollForOutcome(): Effect.Effect<string, RollTooLow>`

You can rename them if you prefer, but keep the ideas the same.

## Expected Outcome

By the end of this stage, you should be able to explain:

- the difference between building an effect and running it
- how to write the smallest possible runnable effect
- what `yield*` is doing inside `Effect.gen(...)`
- what `pipe(...)` is doing when you attach helpers like `catchTag`
- why a tagged error is easier to match than a thrown exception
- why `Effect.runPromise(...)` should stay at the bottom of the file

## Checkpoint

- you got one quick win by printing a line from your own first effect
- `npm run dev` runs your program
- you can see the success path sometimes
- you can see the handled tagged error path sometimes
- all of the logic lives in `src/main.ts`

## Questions

- What was the smallest first effect you ran successfully?
- Which function is just wrapping a plain value?
- Which function is describing a side effect?
- What does `program.pipe(...)` mean in plain language?
- Where does the tagged error get turned into a printed message?

## Manual Verification

Run `npm run dev` several times.

You should eventually see both:

- the success path
- the handled tagged error path

## If You Need Help

Ask a narrow question:

- "Can you explain `pipe(...)` in plain English?"
- "I understand `Effect.succeed`, but I do not understand what `yield*` gives back."
- "Can you review just the tagged error part in `src/main.ts`?"
- "Can you explain why `catchTag` belongs after the failing effect?"
