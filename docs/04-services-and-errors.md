# Stage 4: Services And Tagged Errors

Goal: move the business logic into services and model expected failures as tagged errors.

## Files To Edit

- `src/domain/errors.ts`
- `src/application/AthleteService.ts`
- `src/application/CheckInService.ts`

## Files To Read

- `src/application/AthleteRepository.ts`
- `src/application/CheckInRepository.ts`

## Tagged Errors To Add

Create tagged errors for:

- `AthleteNotFound`
- `DuplicateAthleteName`
- `AthleteCheckInLimitReached`

Use `Data.TaggedError(...)`.

This stage moves the business rules into services and models expected failures as tagged errors.

## Read The Real Files In This Order

1. [src/domain/errors.ts](/Users/fraser/Github/effect-learning/src/domain/errors.ts)
2. [src/application/AthleteService.ts](/Users/fraser/Github/effect-learning/src/application/AthleteService.ts)
3. [src/application/CheckInService.ts](/Users/fraser/Github/effect-learning/src/application/CheckInService.ts)
4. Re-read [src/application/AthleteRepository.ts](/Users/fraser/Github/effect-learning/src/application/AthleteRepository.ts)
5. Re-read [src/application/CheckInRepository.ts](/Users/fraser/Github/effect-learning/src/application/CheckInRepository.ts)

## Example 1: A Tagged Error In Another Domain

Imagine a library app:

```ts
import { Data } from "effect"

export class BookNotFound extends Data.TaggedError("BookNotFound")<{
  readonly bookId: string
}> {}
```

What this gives you:

- a named error type
- structured data on the error
- something you can catch and map later

That is the same pattern you should use for your domain errors.

## Example 2: Turning Null Into A Domain Error

Repositories often return `null` for "not found".

The service turns that into a meaningful business failure.

Example:

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

That is the pattern for `getAthlete` and for the "athlete must exist" checks in `CheckInService`.

## Example 3: A Duplicate Rule In A Service

Here is a non-answer example for a duplicate check:

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

What matters:

- normalize the input in the service
- ask the repository for existing data
- return a tagged error if the business rule fails
- otherwise delegate persistence back to the repository

That is the same shape you want for duplicate athlete names.

## Example 4: A Limit Rule

Another service-layer pattern:

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

That is the same idea as your max `20` check-ins rule.

## Example 5: Services Read Like Application Behavior

A service method should read almost like a sentence:

```ts
recordThing: (ownerId, input) =>
  Effect.gen(function* () {
    // verify owner exists
    // check the business limit
    // store the thing
    // return the stored result
  })
```

That is a useful test:

If the method reads like business behavior, it is probably in the right place.
If it reads like low-level storage mechanics, it probably belongs in a repository.

## Expected Outcome

By the end of this stage, you should be able to:

- explain how repositories report available data
- explain how services turn that data into business behavior
- explain why expected failures are modeled as explicit values

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

1. Export three tagged error classes.
2. Give each one the fields needed to be useful in logs or debugging.

In [src/application/AthleteService.ts](/Users/fraser/Github/effect-learning/src/application/AthleteService.ts):

1. Get `AthleteRepository` from the context.
2. Trim the incoming name inside `createAthlete`.
3. Check for an existing athlete with that trimmed name.
4. Fail with `DuplicateAthleteName` when needed.
5. Delegate persistence back to the repository.
6. Turn `null` into `AthleteNotFound` inside `getAthlete`.

In [src/application/CheckInService.ts](/Users/fraser/Github/effect-learning/src/application/CheckInService.ts):

1. Get both repositories from the context.
2. Verify the athlete exists before doing anything else.
3. Count existing check-ins.
4. Fail with `AthleteCheckInLimitReached` once the count reaches `20`.
5. Delegate to the check-in repository only after the business rules pass.

## What To Notice

- The repository does not know the business rules.
- The service reads like application behavior.
- Errors are values, not thrown exceptions.
- A service method can coordinate multiple repositories without either repository knowing the whole rule.

This is one of the core reasons Effect codebases stay testable and predictable.

## Checkpoint

- Services depend on repositories through `Context.Tag`.
- Known failures are represented as tagged errors.
- The duplicate-name and max-check-in rules live in services, not repositories.
- You can explain why repository `null` results become domain errors in the service layer.

## Questions

- Why does `DuplicateAthleteName` belong in `AthleteService` instead of `AthleteRepository`?
- Why is `AthleteNotFound` useful as a tagged error instead of a thrown exception?

## Manual Verification

- Run `npm run typecheck`.

If you get stuck, reduce each service method to this checklist:

1. Get dependencies.
2. Ask the repository for the data you need.
3. If a business rule fails, `Effect.fail(...)` with a tagged error.
4. Otherwise call the next repository method.
5. Return the success value.

## Common Mistake

- Checking name uniqueness without trimming first.

## If You Need Help

Useful questions for Claude or GPT:

- "Can you explain why this business rule belongs in the service instead of the repository?"
- "Can you help me understand how to turn `null` into a tagged error?"
- "Can you review my service logic and only point out what is wrong?"
