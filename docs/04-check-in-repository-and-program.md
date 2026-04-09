# Stage 4: Check-In Repository And Program Flow

Goal: add the second repository and use both repositories directly from one program before services are introduced.

## Files To Edit

- `src/infrastructure/in-memory/CheckInRepositoryInMemory.ts`
- `src/main.ts`

## Files To Read

- `src/domain/CheckIn.ts`
- `src/application/CheckInRepository.ts`
- `src/infrastructure/in-memory/AthleteRepositoryInMemory.ts`

## What To Build

First, finish the in-memory check-in repository in [src/infrastructure/in-memory/CheckInRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/CheckInRepositoryInMemory.ts).

Its methods are:

- `create(athleteId, input)`
- `listByAthleteId(athleteId)`
- `countByAthleteId(athleteId)`

Then update [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts) so the program constructs both in-memory repositories directly and uses them in order:

1. create an athlete
2. create one or two check-ins for that athlete
3. list the athletes
4. list the check-ins for the created athlete
5. print the results

This stage is deliberately simple.

You are still not using:

- services
- `Context.Tag`
- `Layer`
- `AppLive`

Those all arrive in the next stage.

## Read The Real Files In This Order

1. [src/domain/CheckIn.ts](/Users/fraser/Github/effect-learning/src/domain/CheckIn.ts)
2. [src/application/CheckInRepository.ts](/Users/fraser/Github/effect-learning/src/application/CheckInRepository.ts)
3. [src/infrastructure/in-memory/CheckInRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/CheckInRepositoryInMemory.ts)
4. [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts)

## Example 1: Optional Fields Becoming `null`

```ts
create: (bookId, input) => {
  const review: Review = {
    id: randomUUID(),
    bookId,
    rating: input.rating,
    text: input.text ?? null
  }

  reviews.push(review)
  return Effect.succeed(review)
}
```

That is the pattern for `bodyweightKg` and `notes`.

## Example 2: Filtering By Owner

```ts
listByBookId: (bookId) => {
  const reviewsForBook = reviews.filter((review) => review.bookId === bookId)
  return Effect.succeed(reviewsForBook)
}
```

That is the direct pattern for `listByAthleteId`.

## Example 3: Counting A Subset

```ts
countByBookId: (bookId) => {
  const count = reviews.filter((review) => review.bookId === bookId).length
  return Effect.succeed(count)
}
```

That is the direct pattern for `countByAthleteId`.

## Example 4: One Program Calling Both Repositories

```ts
const athleteRepository = makeAthleteRepositoryInMemory()
const checkInRepository = makeCheckInRepositoryInMemory()

const program = Effect.gen(function* () {
  const athlete = yield* athleteRepository.create({ name: "Adrian" })
  yield* checkInRepository.create(athlete.id, { energy: 7 })
  return yield* checkInRepository.listByAthleteId(athlete.id)
})
```

That is the shape to aim for in this stage.

## What You Should Literally Write

In [src/infrastructure/in-memory/CheckInRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/CheckInRepositoryInMemory.ts):

1. Keep `checkIns` inside the factory.
2. Replace the placeholders with `Effect.succeed(...)` logic.
3. Generate the id with `randomUUID()`.
4. Normalize missing optional values to `null`.
5. Filter and count by `athleteId`.

In [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts):

1. Import both in-memory repository factories.
2. Construct them directly at the top of the file.
3. Build one `Effect.gen(...)` program.
4. Create an athlete.
5. Create one or two check-ins.
6. List and print the current in-memory data.

## Expected Outcome

By the end of this stage, you should be able to explain:

- how repository methods fit naturally into an Effect program
- why the program can mutate in-memory state across multiple calls
- why this is still simpler than introducing services too early

## Checkpoint

- both repositories work
- the program shows created in-memory data
- rerunning the program starts from fresh in-memory state

## Questions

- Why does rerunning the program start from an empty array again?
- Why is the program still constructing repositories directly at this stage?

## Manual Verification

1. Run `npm run dev`
2. Confirm the terminal output shows the created athlete
3. Confirm the terminal output shows the created check-ins

## Common Mistake

- counting all check-ins instead of only that athlete's check-ins

## If You Need Help

Useful questions:

- "Can you review whether `countByAthleteId` is counting the right subset?"
- "Can you explain how the in-memory state survives across calls inside one run?"
