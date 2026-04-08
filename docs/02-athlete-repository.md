# Stage 2: Athlete Repository

Goal: implement your first `Context.Tag` service and its in-memory layer.

## Files To Edit

- `src/application/AthleteRepository.ts`
- `src/infrastructure/in-memory/AthleteRepositoryInMemory.ts`

## Files To Read

- `src/domain/Athlete.ts`

## What To Build

Your repository shape is already prescribed in [src/application/AthleteRepository.ts](/Users/fraser/Github/effect-learning/src/application/AthleteRepository.ts).

The service methods are:

- `create(input)`
- `getById(id)`
- `getByName(name)`
- `list()`

Your main job in this stage is to finish the in-memory implementation in [src/infrastructure/in-memory/AthleteRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/AthleteRepositoryInMemory.ts).

The examples below use other domains so you can see the pattern without copying the final answer directly.

## Read The Real Files In This Order

1. [src/domain/Athlete.ts](/Users/fraser/Github/effect-learning/src/domain/Athlete.ts)
2. [src/application/AthleteRepository.ts](/Users/fraser/Github/effect-learning/src/application/AthleteRepository.ts)
3. [src/infrastructure/in-memory/AthleteRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/AthleteRepositoryInMemory.ts)

That order works because:

- the domain file shows the data shape
- the repository tag file shows the interface
- the in-memory file is where you actually implement it

## Example 1: A Small Repository Tag

Imagine a repo for books instead of athletes:

```ts
import { Context, Layer, type Effect } from "effect"

interface Book {
  readonly id: string
  readonly title: string
}

interface CreateBookInput {
  readonly title: string
}

interface BookRepositoryService {
  readonly create: (input: CreateBookInput) => Effect.Effect<Book>
  readonly getById: (id: string) => Effect.Effect<Book | null>
  readonly list: () => Effect.Effect<ReadonlyArray<Book>>
}

class BookRepository extends Context.Tag("BookRepository")<
  BookRepository,
  BookRepositoryService
>() {
  static readonly InMemory = Layer.sync(this, makeBookRepositoryInMemory)
}
```

What matters here:

- the tag is named `BookRepository`
- the tag's shape is the service interface
- the live implementation is provided by a layer

That is the same pattern you are using for `AthleteRepository`.

## Example 2: The In-Memory Factory Pattern

Here is what an in-memory repository factory looks like in general:

```ts
const makeBookRepositoryInMemory = (): BookRepositoryService => {
  const books: Book[] = []

  return {
    create: (input) => {
      const book: Book = {
        id: crypto.randomUUID(),
        title: input.title
      }

      books.push(book)
      return Effect.succeed(book)
    },
    getById: (id) => {
      const book = books.find((book) => book.id === id) ?? null
      return Effect.succeed(book)
    },
    list: () => Effect.succeed(books)
  }
}
```

What matters here:

- the array lives inside the factory
- the returned object closes over that array
- every method returns an `Effect`
- there is no global state

This is the key thing to understand:

when the layer is created, it creates one concrete implementation of the repository, and that implementation owns the in-memory array it closes over.

## Example 3: Returning Null When Something Is Missing

A repository often returns `null` when something is not found:

```ts
getById: (id) => {
  const order = orders.find((order) => order.id === id) ?? null
  return Effect.succeed(order)
}
```

That is normal in the repository layer.

Later, in the service layer, you will convert `null` into a tagged domain error such as `AthleteNotFound`.

That split is deliberate:

- repository: "I looked and there was nothing there"
- service: "that absence means a business failure"

## Example 4: A Create Method

Here is another example, this time for a notes repo:

```ts
create: (input) => {
  const note: Note = {
    id: randomUUID(),
    text: input.text
  }

  notes.push(note)
  return Effect.succeed(note)
}
```

The pattern is:

1. build the entity
2. store it
3. return it inside `Effect.succeed(...)`

That is the same pattern your athlete repo should follow.

## Example 5: Looking Up By Another Field

Your athlete repo also needs `getByName`.

Here is the same idea in a different domain:

```ts
getByEmail: (email) => {
  const user = users.find((user) => user.email === email) ?? null
  return Effect.succeed(user)
}
```

That is all `getByName` really is:

- search the array
- return the matching item or `null`
- wrap the result in an `Effect`

## Translate The Pattern To Athletes

Now map those examples back to your real task.

Your `AthleteRepository` should end up with methods that behave like this:

```ts
create: (input) => {
  // build an athlete object
  // store it in the athletes array
  // return Effect.succeed(theAthlete)
}

getById: (id) => {
  // search athletes by id
  // return Effect.succeed(athleteOrNull)
}

getByName: (name) => {
  // search athletes by name
  // return Effect.succeed(athleteOrNull)
}

list: () => {
  // return all athletes
  return Effect.succeed(athletes)
}
```

That is the level of complexity you should be aiming for in this stage. Nothing more.

## Expected Outcome

By the end of this stage, you should be able to:

- explain how a repository tag is declared
- explain how an in-memory implementation can close over an array
- explain why even simple synchronous methods still return `Effect`

It is also normal if these parts still feel incomplete at this point:

- understanding all of Effect
- seeing the full app in one pass

## What You Should Literally Write

In [src/infrastructure/in-memory/AthleteRepositoryInMemory.ts](/Users/fraser/Github/effect-learning/src/infrastructure/in-memory/AthleteRepositoryInMemory.ts):

1. Keep the `athletes` array inside `makeAthleteRepositoryInMemory`.
2. Replace each `Effect.die(...)` placeholder with normal repository logic.
3. Use `randomUUID()` for the id.
4. Wrap successful results with `Effect.succeed(...)`.
5. Return `null` from `getById` and `getByName` when nothing matches.

You are not adding:

- duplicate-name rules
- schema validation
- tagged errors
- HTTP logic

Those all belong to later stages.

## What The Code Should Do

- Keep an in-memory `athletes` array inside the layer factory.
- `create` should generate a UUID, store the athlete, and return it.
- `getById` should return the athlete or `null`.
- `getByName` should return the athlete or `null`.
- `list` should return the current athletes.

## What To Notice

- The `Context.Tag` gives you a typed dependency name.
- The repository is only about data access.
- The in-memory array lives inside the layer factory, so it becomes the state for that live implementation.
- A repository method can still be very simple and still be worth wrapping in `Effect`.

## Why The Abstraction Exists

You could use an array directly in route handlers, but then:

- your HTTP layer would own persistence details
- your business logic would be harder to test cleanly
- swapping implementations later would be messy

With a repository tag, the rest of the app depends on behavior, not on a specific storage mechanism.

## Checkpoint

- `AthleteRepository.InMemory` returns working methods.
- You understand why the array lives inside the factory.
- You can explain why this is a dependency and not a global variable.
- You can explain why the repository returns `Effect` values even though the work is synchronous.

## Questions

- Why is the repository a `Context.Tag` instead of a plain exported object?
- Why is the array created inside `makeAthleteRepositoryInMemory`?
- Why does the repository return `null` for missing data instead of throwing a domain error here?

## Manual Verification

- Run `npm run typecheck`.

If TypeScript complains, the most likely causes are:

- returning a raw value instead of `Effect.succeed(...)`
- forgetting `null` in a lookup method
- returning the wrong shape from `create`

## Common Mistake

- Putting business rules such as duplicate-name checking into the repository. That belongs in the service layer later.

## If You Need Help

Ask Claude or GPT about this stage only.

Useful questions:

- "Can you explain why this repository method returns `Effect.succeed(...)` instead of a raw value?"
- "Can you help me understand what should live inside `makeAthleteRepositoryInMemory`?"
- "Can you review my `AthleteRepositoryInMemory.ts` without giving me the final answer unless I ask?"
