# Primer

This repo teaches a small slice of Effect by building a backend API for athlete check-ins.

You do not need to understand the whole library up front. You do need a rough mental model of how the core pieces fit together.

## The Effect Type

An `Effect` is a typed description of work.

The shape is:

`Effect<A, E, R>`

Read that as:

- `A`: the success value it can return
- `E`: the expected error type it can fail with
- `R`: the dependencies it needs in order to run

That third type parameter is the one that usually feels unusual at first.

It means an effect can say:

- "If you give me these dependencies..."
- "...I can run..."
- "...and I will either succeed with this value or fail with this error."

So Effect is not only about async work. It is also about making requirements explicit in the type system.

Tiny example:

```ts
type GetAthleteEffect = Effect.Effect<Athlete, AthleteNotFound, AthleteRepository>
```

Read that as:

- this effect succeeds with an `Athlete`
- it can fail with `AthleteNotFound`
- it needs an `AthleteRepository` in order to run

That is the basic mental model you want to keep in your head throughout this repo.

## Dependencies

In a typical codebase, a function might quietly reach into:

- a database client
- a logger
- a repository
- some config

Effect prefers making those dependencies visible.

That is what the `R` type is for.

If a function needs an `AthleteRepository`, that dependency appears in the effect type instead of being hidden in a global variable or hard-coded import.

Tiny example:

```ts
const program = Effect.gen(function* () {
  const athleteRepository = yield* AthleteRepository
  return yield* athleteRepository.getById("athlete-1")
})
```

That program is saying:

- I need an `AthleteRepository`
- once I have it, I can call one of its methods
- until that dependency is provided, this is still just a description of work

## Context.Tag

`Context.Tag` gives a dependency a stable identity and a type.

In practice, that means:

- you define a tag for a service such as `AthleteRepository`
- code can say "I need this dependency"
- other code can provide the concrete implementation later

So a tag is not the implementation itself. It is the typed name for a dependency that an effect can require.

This is the core dependency-injection idea in Effect:

- effects declare what they need
- tags identify those needs
- implementations get provided later

Tiny example:

```ts
class AthleteRepository extends Context.Tag("AthleteRepository")<
  AthleteRepository,
  {
    readonly getById: (id: string) => Effect.Effect<Athlete | null>
  }
>() {}
```

That does not create a repository implementation.
It creates the typed dependency name that other code can ask for.

## Layer

A `Layer` is how you provide an implementation for one or more tags.

For example:

- `AthleteRepository.InMemory` can provide the in-memory implementation
- `AthleteRepository.Json` can provide the JSON-backed implementation

If an effect requires a repository dependency, the layer is what fulfills that requirement.

You can also combine many layers together into one larger layer. That matters because a real program usually needs more than one dependency.

In this repo, you will compose layers so the app can provide:

- `AthleteRepository`
- `CheckInRepository`
- `AthleteService`
- `CheckInService`

Then the HTTP layer can run effects against that combined live layer.

That is the high-level flow:

1. Effects describe work and requirements.
2. Tags name the required dependencies.
3. Layers provide the implementations.
4. Once the dependencies are provided, the effect can run.

Tiny example:

```ts
const AppLive = Layer.mergeAll(
  AthleteRepository.InMemory,
  CheckInRepository.InMemory,
  AthleteService.Live,
  CheckInService.Live
)
```

Then, later:

```ts
const result = await Effect.runPromise(
  Effect.provide(program, AppLive)
)
```

That is the moment where the effect gets the dependencies it said it needed.

## Errors

Effect also makes expected failures explicit.

Instead of throwing exceptions for normal application problems, you model them as values.

In this course, that means tagged errors such as:

- `AthleteNotFound`
- `DuplicateAthleteName`
- `AthleteCheckInLimitReached`

That makes the service layer easier to reason about and lets the HTTP layer map those failures cleanly to status codes.

Tiny example:

```ts
export class AthleteNotFound extends Data.TaggedError("AthleteNotFound")<{
  readonly athleteId: string
}> {}
```

Then a service can fail with it deliberately:

```ts
if (athlete === null) {
  return yield* Effect.fail(new AthleteNotFound({ athleteId: id }))
}
```

That is very different from an unexpected exception. It is a normal, modeled application failure.

## The Split In This Repo

This repo keeps each concern in one place:

- `Hono` handles HTTP
- `Schema` decodes unknown request data into typed input
- services hold business rules
- repositories hold persistence logic
- layers wire concrete implementations into the app

That separation is the main thing you are learning here.

You are not trying to learn every module in Effect. You are learning how a few core ideas fit together to make backend code explicit, testable, and easy to swap.

## Checkpoint

- You can read `Effect<A, E, R>` at a high level.
- You know that `R` represents dependencies.
- You know that a `Context.Tag` names a dependency and a `Layer` provides it.
- You know that HTTP stays thin and the business logic lives elsewhere.

## Questions

- In `Effect<A, E, R>`, what do `A`, `E`, and `R` each mean?
- What problem does `Context.Tag` solve?
- What does a `Layer` actually provide?
- What is the difference between a service and a repository in this repo?

## Manual Verification

- Read the file once in markdown preview.

## Common Mistake

- Thinking a tag is the implementation itself. The tag names the dependency; the layer provides the implementation.
