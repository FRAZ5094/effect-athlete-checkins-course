# Primer

This repo teaches a small slice of Effect by building one terminal program for athlete check-ins.

The course deliberately starts smaller than a web app:

1. write a few tiny effects
2. sequence them with `Effect.gen(...)`
3. model an expected failure with a tagged error
4. build repositories that return effects
5. only then introduce `Context.Tag`, `Layer`, and services

You do not need the whole library up front. You need a working mental model.

## The Three Questions In `Effect<A, E, R>`

An `Effect` is a typed description of work.

Its shape is:

`Effect<A, E, R>`

Read that as:

- `A`: what success value comes back
- `E`: what expected error can come back
- `R`: what dependencies are still required

At the start of this course, most of your effects will not need dependencies yet, so the early focus is mostly on `A` and `E`.

Tiny example:

```ts
const getGreeting = (name: string): Effect.Effect<string> =>
  Effect.succeed(`Hello, ${name}`)
```

That effect:

- succeeds with a `string`
- has no expected error
- has no dependency requirement

## Effects Describe Work

An effect is not the result itself.

It is a description of work you can run later.

Tiny example:

```ts
const printGreeting = (name: string) =>
  Effect.sync(() => {
    console.log(`Hello, ${name}`)
  })
```

That does not print anything yet.
It builds a value that says how to print something when the runtime runs it.

Then the entrypoint runs it:

```ts
await Effect.runPromise(program)
```

That separation matters because the course keeps building bigger programs out of smaller effects.

## `Effect.gen(...)`

`Effect.gen(...)` is the easiest way to read a sequence of effects from top to bottom.

Tiny example:

```ts
const program = Effect.gen(function* () {
  const greeting = yield* getGreeting("Fraser")
  yield* printGreeting(greeting)
})
```

Beginner translation:

- `yield*` means "run this effect and give me its success value"
- the generator lets you write multi-step logic in order

That is the main style you will use in this repo.

## Tagged Errors

Effect prefers expected failures as values instead of thrown exceptions.

Tiny example:

```ts
class RollTooLow extends Data.TaggedError("RollTooLow")<{
  readonly roll: number
}> {}
```

Then an effect can fail with it:

```ts
if (roll <= 3) {
  return yield* Effect.fail(new RollTooLow({ roll }))
}
```

And another effect can handle it explicitly:

```ts
program.pipe(
  Effect.catchTag("RollTooLow", (error) =>
    printGreeting(`Try again, you rolled ${error.roll}`)
  )
)
```

That is why tagged errors are useful:

- the failure has a stable name
- the failure can carry structured data
- the recovery code can match that exact error type

## Repositories First, Dependencies Later

After the intro program, you will build in-memory repositories.

Those repositories still return `Effect`, but you will call them directly at first.

That keeps the learning path simpler:

- first learn how to write and run effects
- then use effects in repository methods
- then add services and dependency injection later

## `Context.Tag` And `Layer`

These appear later in the course on purpose.

Once the learner already understands:

- how to return an `Effect`
- how to sequence effects in a program
- how to model an expected failure

then `Context.Tag` and `Layer` become much easier to understand.

The short version:

- `Context.Tag` gives a dependency a typed name
- `Layer` provides a concrete implementation for that dependency

Later in the repo, the main program will switch from:

- constructing repositories directly

to:

- asking for services from the context
- providing them with `AppLive`

That later step is how the course introduces the `R` in `Effect<A, E, R>`.

## A Good Working Mental Model

Keep this in your head as you go:

1. An effect describes work.
2. `Effect.gen(...)` sequences many effects into one program.
3. Tagged errors model expected failures.
4. Repositories can return effects even when they are simple.
5. `Context.Tag` and `Layer` are how bigger programs ask for dependencies later.

If something feels fuzzy, ask a narrow question before moving on.

Useful questions:

- "Can you explain why `Effect.succeed(...)` and `Effect.sync(...)` are different?"
- "What exactly does `yield*` give me back inside `Effect.gen(...)`?"
- "Why is a tagged error better than throwing in this repo?"
- "What does the `R` start to mean once we get to layers?"
