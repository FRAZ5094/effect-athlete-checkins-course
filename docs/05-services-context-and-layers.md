# Stage 5: Services, `Context.Tag`, And Layers

Goal: move the business rules into services, model expected failures as tagged errors, and make the main program runnable through `AppLive`.

## Files To Edit

- `src/domain/errors.ts`
- `src/application/AthleteService.ts`
- `src/application/CheckInService.ts`
- `src/application/AppLive.ts`
- `src/main.ts`

## Files To Read

- `src/application/AthleteRepository.ts`
- `src/application/CheckInRepository.ts`

## What Changes In This Stage

Until now, `src/main.ts` has been constructing repositories directly.

In this stage, you will change that.

The new flow becomes:

1. repositories stay focused on persistence
2. services hold the business rules
3. `Context.Tag` names those dependencies
4. `Layer` provides the live implementations
5. `AppLive` composes the live graph
6. `main.ts` runs `Effect.provide(program, AppLive)`

This is the point where the `R` in `Effect<A, E, R>` becomes concrete.

## Tagged Errors To Add

Create tagged errors for:

- `AthleteNotFound`
- `DuplicateAthleteName`
- `AthleteCheckInLimitReached`

Use `Data.TaggedError(...)`.

## Read The Real Files In This Order

1. [src/domain/errors.ts](/Users/fraser/Github/effect-learning/src/domain/errors.ts)
2. [src/application/AthleteService.ts](/Users/fraser/Github/effect-learning/src/application/AthleteService.ts)
3. [src/application/CheckInService.ts](/Users/fraser/Github/effect-learning/src/application/CheckInService.ts)
4. [src/application/AppLive.ts](/Users/fraser/Github/effect-learning/src/application/AppLive.ts)
5. [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts)

## Example 1: Turning `null` Into A Domain Error

```ts
getBook: (id) =>
  Effect.gen(function* () {
    const bookRepository = yield* BookRepository
    const book = yield* bookRepository.getById(id)

    if (book === null) {
      return yield* Effect.fail(new BookNotFound({ bookId: id }))
    }

    return book
  })
```

That is the pattern for `getAthlete`.

## Example 2: A Duplicate Rule In A Service

```ts
createBook: (input) =>
  Effect.gen(function* () {
    const bookRepository = yield* BookRepository
    const trimmedTitle = input.title.trim()
    const existingBook = yield* bookRepository.getByTitle(trimmedTitle)

    if (existingBook !== null) {
      return yield* Effect.fail(
        new DuplicateBookTitle({ title: trimmedTitle })
      )
    }

    return yield* bookRepository.create({ title: trimmedTitle })
  })
```

That is the pattern for `createAthlete`.

## Example 3: A Limit Rule

```ts
addReview: (bookId, input) =>
  Effect.gen(function* () {
    const bookRepository = yield* BookRepository
    const reviewRepository = yield* ReviewRepository

    const book = yield* bookRepository.getById(bookId)
    if (book === null) {
      return yield* Effect.fail(new BookNotFound({ bookId }))
    }

    const reviewCount = yield* reviewRepository.countByBookId(bookId)
    if (reviewCount >= 5) {
      return yield* Effect.fail(new ReviewLimitReached({ bookId, limit: 5 }))
    }

    return yield* reviewRepository.create(bookId, input)
  })
```

That is the same pattern as the `20` check-in rule.

## Example 4: `Context.Tag`

The repository and service tag files are giving dependencies a typed name.

Beginner translation:

- the tag is the label for the dependency
- `yield* AthleteRepository` means "give me the live implementation for this dependency"

That is why the service code can stay decoupled from the concrete implementation.

## Example 5: `Layer`

The layer is what provides the concrete implementation.

```ts
export const AppLive = Layer.mergeAll(
  AthleteRepository.InMemory,
  CheckInRepository.InMemory,
  AthleteService.Live,
  CheckInService.Live
)
```

Then the entrypoint can run the program with those dependencies:

```ts
Effect.runPromise(Effect.provide(program, AppLive))
```

That line is the core payoff of the stage.

## AthleteService Rules

In [src/application/AthleteService.ts](/Users/fraser/Github/effect-learning/src/application/AthleteService.ts):

- `createAthlete(input)`
  - trim the incoming name
  - ask the repository for an existing athlete with that trimmed name
  - fail with `DuplicateAthleteName` if one exists
  - otherwise create the athlete
- `getAthlete(id)`
  - ask the repository for the athlete
  - fail with `AthleteNotFound` if it returns `null`
  - otherwise return the athlete

## CheckInService Rules

In [src/application/CheckInService.ts](/Users/fraser/Github/effect-learning/src/application/CheckInService.ts):

- `recordCheckIn(athleteId, input)`
  - verify the athlete exists
  - fail with `AthleteNotFound` if not
  - count the athlete's existing check-ins
  - fail with `AthleteCheckInLimitReached` once there are already `20`
  - otherwise create the check-in
- `listCheckIns(athleteId)`
  - verify the athlete exists
  - fail with `AthleteNotFound` if not
  - otherwise return that athlete's check-ins

## What You Should Literally Write

In [src/domain/errors.ts](/Users/fraser/Github/effect-learning/src/domain/errors.ts):

1. Export the three tagged error classes.
2. Give them useful fields.

In [src/application/AthleteService.ts](/Users/fraser/Github/effect-learning/src/application/AthleteService.ts):

1. Pull `AthleteRepository` from the context.
2. Implement the duplicate-name rule.
3. Turn missing athletes into `AthleteNotFound`.

In [src/application/CheckInService.ts](/Users/fraser/Github/effect-learning/src/application/CheckInService.ts):

1. Pull `AthleteRepository` and `CheckInRepository` from the context.
2. Check that the athlete exists.
3. Enforce the max-20 rule.
4. Delegate persistence back to the repository.

In [src/application/AppLive.ts](/Users/fraser/Github/effect-learning/src/application/AppLive.ts):

1. Compose the two repository layers.
2. Compose the two service layers.
3. Keep all live wiring in this file.

In [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts):

1. Stop constructing repositories directly.
2. Pull services from the context.
3. Build the same program flow through services instead.
4. Catch tagged errors and print useful messages.
5. Wrap the program with `Effect.provide(program, AppLive)` before running it.

## Expected Outcome

By the end of this stage, you should be able to explain:

- why repositories return `null` but services return tagged domain errors
- why `Context.Tag` exists
- why `Layer` exists
- why `AppLive` keeps the wiring in one place

## Checkpoint

- services hold the business rules
- tagged errors are defined
- `AppLive` composes the live layers
- `main.ts` runs the provided program

## Questions

- Why does `DuplicateAthleteName` belong in the service instead of the repository?
- What exactly does `Effect.provide(program, AppLive)` change?

## Manual Verification

1. Run `npm run dev`
2. Confirm the program still creates and prints data
3. Trigger at least one tagged error path and confirm the printed message matches it
4. Run `npm run typecheck`

## Common Mistake

- leaving repository construction in `src/main.ts` after introducing `AppLive`

## If You Need Help

Useful questions:

- "Can you explain why `Context.Tag` becomes useful only now?"
- "Can you review whether my service logic is leaking persistence details?"
- "Can you check whether `main.ts` is providing the layer in the right place?"
