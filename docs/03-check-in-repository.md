# Stage 3: Check-In Repository And App Layer

Goal: add the second repository and compose the live application layer.

## Files To Edit

- `src/application/CheckInRepository.ts`
- `src/infrastructure/in-memory/CheckInRepositoryInMemory.ts`
- `src/application/AppLive.ts`

## Files To Read

- `src/domain/CheckIn.ts`
- `src/application/AthleteRepository.ts`

## What To Build

Finish the in-memory check-in repository in [src/infrastructure/in-memory/CheckInRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/CheckInRepositoryInMemory.ts).

Its methods are:

- `create(athleteId, input)`
- `listByAthleteId(athleteId)`
- `countByAthleteId(athleteId)`

Then go to [src/application/AppLive.ts](/Users/fraser/Github/effect-learning/src/application/AppLive.ts) and compose the live layers for:

- `AthleteRepository.InMemory`
- `CheckInRepository.InMemory`
- `AthleteService.Live`
- `CheckInService.Live`

Use `Layer.mergeAll(...)`.

This stage extends the same repository pattern from the previous stage and adds the first composed application layer.

## Read The Real Files In This Order

1. [src/domain/CheckIn.ts](/Users/fraser/Github/effect-learning/src/domain/CheckIn.ts)
2. [src/application/CheckInRepository.ts](/Users/fraser/Github/effect-learning/src/application/CheckInRepository.ts)
3. [src/infrastructure/in-memory/CheckInRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/CheckInRepositoryInMemory.ts)
4. [src/application/AppLive.ts](/Users/fraser/Github/effect-learning/src/application/AppLive.ts)

## Example 1: A Second Repository In Another Domain

Imagine you already had a `BookRepository` and now you needed a `ReviewRepository`.

The second repository would look familiar:

```ts
interface Review {
  readonly id: string
  readonly bookId: string
  readonly rating: number
  readonly text: string | null
}

interface CreateReviewInput {
  readonly rating: number
  readonly text?: string | null
}

interface ReviewRepositoryService {
  readonly create: (
    bookId: string,
    input: CreateReviewInput
  ) => Effect.Effect<Review>
  readonly listByBookId: (
    bookId: string
  ) => Effect.Effect<ReadonlyArray<Review>>
  readonly countByBookId: (bookId: string) => Effect.Effect<number>
}
```

That is the same kind of step you are taking now:

- you already built `AthleteRepository`
- now you are building `CheckInRepository`
- the pattern stays the same

## Example 2: Optional Fields Becoming Null

If an input field is optional, the repository can normalize it before storing it.

Example:

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

This is the same idea you need for:

- `bodyweightKg`
- `notes`

If the input omits them, store `null`.

## Example 3: Filtering By Foreign Key

Your `listByAthleteId` method should filter the array to one athlete.

In another domain:

```ts
listByBookId: (bookId) => {
  const matchingReviews = reviews.filter((review) => review.bookId === bookId)
  return Effect.succeed(matchingReviews)
}
```

That is exactly the shape you want.

## Example 4: Counting A Subset

Do not count every row in memory. Count only the ones for the requested owner.

Example:

```ts
countByBookId: (bookId) => {
  const count = reviews.filter((review) => review.bookId === bookId).length
  return Effect.succeed(count)
}
```

That is the direct pattern for `countByAthleteId`.

## Example 5: Layer Composition

Now the second half of the stage.

Imagine a different app with:

- `BookRepository.InMemory`
- `ReviewRepository.InMemory`
- `BookService.Live`
- `ReviewService.Live`

You could compose them like this:

```ts
export const AppLive = Layer.mergeAll(
  BookRepository.InMemory,
  ReviewRepository.InMemory,
  BookService.Live,
  ReviewService.Live
)
```

That is the whole point of the composition file:

- put the wiring in one place
- keep the rest of the app depending on tags
- make implementation swaps happen at the boundary

## Translate The Pattern To Check-Ins

Your real repository should behave like this:

```ts
create: (athleteId, input) => {
  // build a CheckIn with a UUID
  // normalize missing optional fields to null
  // push into the checkIns array
  // return Effect.succeed(theCheckIn)
}

listByAthleteId: (athleteId) => {
  // filter the array to this athlete's check-ins
  // return Effect.succeed(filteredCheckIns)
}

countByAthleteId: (athleteId) => {
  // count only this athlete's check-ins
  // return Effect.succeed(theCount)
}
```

Then `AppLive` should end up with a shape like:

```ts
export const AppLive = Layer.mergeAll(
  AthleteRepository.InMemory,
  CheckInRepository.InMemory,
  AthleteService.Live,
  CheckInService.Live
)
```

## Expected Outcome

By the end of this stage, you should be able to:

- repeat the repository pattern for another entity
- explain why one file is responsible for wiring the live app
- see how an implementation swap can stay localized to the composition layer

## What You Should Literally Write

In [src/infrastructure/in-memory/CheckInRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/CheckInRepositoryInMemory.ts):

1. Keep `checkIns` inside the factory.
2. Replace the placeholders with `Effect.succeed(...)` logic.
3. Generate the id with `randomUUID()`.
4. Normalize missing optional values to `null`.
5. Filter and count by `athleteId`, not globally.

In [src/application/AppLive.ts](/Users/fraser/Github/effect-learning/src/application/AppLive.ts):

1. Import the two repositories and two services.
2. Use `Layer.mergeAll(...)`.
3. Keep all live wiring in this file.

## What The Check-In Repository Should Do

- Keep an in-memory `checkIns` array inside the factory.
- `create` should generate a UUID, convert missing `bodyweightKg` to `null`, convert missing `notes` to `null`, store the check-in, and return it.
- `listByAthleteId` should only return check-ins for the requested athlete.
- `countByAthleteId` should return the count for that athlete only.

## Why This Stage Exists

This is your first look at layer composition.

You now have:

- one repository for athletes
- one repository for check-ins
- two service layers that will depend on those repositories
- one place where the live app wiring is assembled

That is the dependency graph you will keep building on.

## Checkpoint

- Both in-memory repositories work.
- `AppLive` composes the four live layers.
- You can explain what `AppLive` provides at a high level.
- You can explain why swapping implementations later should only touch this file.

## Questions

- Why keep the app layer composition in one file?
- What would need to change if you later swapped one repository implementation?

## Manual Verification

- Run `npm run typecheck`.

If TypeScript complains, the most likely causes are:

- `countByAthleteId` counting every check-in instead of one athlete's check-ins
- forgetting to normalize optional fields to `null`
- forgetting imports in `AppLive`

## Common Mistake

- Returning the total number of check-ins across all athletes from `countByAthleteId`.

## If You Need Help

Ask Claude or GPT focused questions about the current step.

Useful questions:

- "Can you explain what `AppLive` is providing here?"
- "Can you review whether my `countByAthleteId` is counting the right thing?"
- "Can you explain layer composition in this stage without jumping ahead?"
