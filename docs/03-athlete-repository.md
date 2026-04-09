# Stage 3: Athlete Repository

Goal: implement the first in-memory repository and keep it focused on persistence only.

## Files To Edit

- `src/infrastructure/in-memory/AthleteRepositoryInMemory.ts`

## Files To Read

- `src/domain/Athlete.ts`
- `src/application/AthleteRepository.ts`

## What To Build

Finish the in-memory athlete repository in [src/infrastructure/in-memory/AthleteRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/AthleteRepositoryInMemory.ts).

The repository methods are:

- `create(input)`
- `getById(id)`
- `getByName(name)`
- `list()`

For now, ignore the `Context.Tag` and `Layer` parts in [src/application/AthleteRepository.ts](/Users/fraser/Github/effect-learning/src/application/AthleteRepository.ts).

In this stage, the thing that matters is only the service shape:

- each method returns an `Effect`
- the repository stores state in memory
- not-found cases return `null`

## Read The Real Files In This Order

1. [src/domain/Athlete.ts](/Users/fraser/Github/effect-learning/src/domain/Athlete.ts)
2. [src/application/AthleteRepository.ts](/Users/fraser/Github/effect-learning/src/application/AthleteRepository.ts)
3. [src/infrastructure/in-memory/AthleteRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/AthleteRepositoryInMemory.ts)

## Example 1: In-Memory State Inside A Factory

```ts
const makeBookRepositoryInMemory = (): BookRepositoryService => {
  const books: Book[] = []

  return {
    list: () => Effect.succeed(books)
  }
}
```

The important idea is that the array lives inside the factory, not in a global variable.

## Example 2: A Create Method

```ts
create: (input) => {
  const book: Book = {
    id: randomUUID(),
    title: input.title
  }

  books.push(book)
  return Effect.succeed(book)
}
```

That same pattern applies to athletes.

## Example 3: Return `null` For Missing Data

```ts
getById: (id) => {
  const book = books.find((book) => book.id === id) ?? null
  return Effect.succeed(book)
}
```

That is the repository-level meaning of "not found".

Later, the service layer will turn that `null` into a tagged domain error.

## Example 4: Looking Up By Another Field

```ts
getByEmail: (email) => {
  const user = users.find((user) => user.email === email) ?? null
  return Effect.succeed(user)
}
```

That is the pattern for `getByName`.

## What You Should Literally Write

In [src/infrastructure/in-memory/AthleteRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/AthleteRepositoryInMemory.ts):

1. Keep the `athletes` array inside `makeAthleteRepositoryInMemory`.
2. Replace each `Effect.die(...)` placeholder with normal repository logic.
3. Use `randomUUID()` for the id.
4. Wrap successful results with `Effect.succeed(...)`.
5. Return `null` from `getById` and `getByName` when nothing matches.

Do not add:

- duplicate-name rules
- tagged errors
- services
- layer wiring in the main program

Those belong later.

## Expected Outcome

By the end of this stage, you should be able to explain:

- why even simple repository methods still return `Effect`
- why the in-memory array lives inside the factory
- why `null` is acceptable in a repository but not ideal in a service

## Checkpoint

- `create` stores a new athlete
- `getById` returns the right athlete or `null`
- `getByName` returns the right athlete or `null`
- `list` returns the current athletes

## Questions

- Why is the repository allowed to return `null` here?
- Why should duplicate-name rules stay out of this file?

## Manual Verification

- Run `npm run typecheck`

## Common Mistake

- putting business rules in the repository instead of just persistence logic

## If You Need Help

Useful questions:

- "Can you review only the `create` method in `AthleteRepositoryInMemory.ts`?"
- "Can you explain why the array should stay inside the factory?"

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
