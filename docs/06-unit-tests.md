# Stage 6: Unit Tests

Goal: test the business logic by providing mocked dependencies with `Layer.mock(...)`.

## Files To Edit

- `src/testing/AthleteService.test.ts`
- `src/testing/CheckInService.test.ts`

## Test Style

Keep these as unit tests only.

Do not test:

- `Hono`
- HTTP routing
- Postman flows
- file persistence

Only test service behavior.

## What To Use

Use:

- `Vitest`
- `Layer.mock(...)`
- the real service layers

The basic pattern is:

1. Build mocked repository layers with `Layer.mock(...)`
2. Provide those layers plus the service live layer
3. Run the service effect
4. Assert on the result or on the tagged error

## Read This First

This stage is where the dependency-injection story becomes concrete.

You built repositories as dependencies.
You provided them through layers.
Now you get the payoff:

- swap the real repositories for mocked ones
- keep the real service code
- test business behavior in isolation

That is why the earlier structure matters.

## Example 1: A Mocked Repository Layer

Imagine a `BookRepository` tag with methods like `getById` and `create`.

A test mock can look like this:

```ts
const BookRepositoryTest = Layer.mock(BookRepository)({
  getById: (id) =>
    Effect.succeed(
      id === "book-1" ? { id: "book-1", title: "Squat Book" } : null
    ),
  create: (input) =>
    Effect.succeed({
      id: "book-2",
      title: input.title
    }),
  list: () => Effect.succeed([])
})
```

That is the pattern you want for your repository dependencies.

## Example 2: Providing The Real Service With Fake Dependencies

Non-answer example:

```ts
const TestLayer = Layer.mergeAll(
  BookRepositoryTest,
  BookService.Live
)

const program = Effect.gen(function* () {
  const bookService = yield* BookService
  return yield* bookService.getBook("book-1")
})

const result = await Effect.runPromise(
  Effect.provide(program, TestLayer)
)
```

What matters:

- the service is real
- the dependency is fake
- the test only cares about business behavior

## Example 3: Asserting On A Tagged Error

Another non-answer example:

```ts
const exit = await Effect.runPromiseExit(
  Effect.provide(program, TestLayer)
)

expect(Exit.isFailure(exit)).toBe(true)

if (Exit.isFailure(exit) && Cause.isFailType(exit.cause)) {
  expect(exit.cause.error._tag).toBe("BookNotFound")
}
```

You do not need to use this exact assertion style, but you do need to assert on the tagged error, not just "something threw".

## Example 4: A Limit Rule Test

Non-answer example:

```ts
const ReviewRepositoryTest = Layer.mock(ReviewRepository)({
  create: () => Effect.die("should not be called"),
  listByBookId: () => Effect.succeed([]),
  countByBookId: () => Effect.succeed(5)
})
```

That kind of setup lets you test the limit logic without creating real records first.

That is the same pattern you want for the `20` check-in limit.

## Example 5: The Shape Of A Good Service Test

A good service test usually has this shape:

```ts
it("fails when a business rule is broken", async () => {
  // build mocked dependency layers
  // provide the real service layer
  // run the effect
  // assert on the tagged error
})
```

Keep the test focused on one business rule at a time.

## AthleteService Tests

Write tests for:

- creating an athlete when the name is unique
- failing with `DuplicateAthleteName` when the trimmed name already exists
- returning an athlete by id
- failing with `AthleteNotFound` when the athlete does not exist

## CheckInService Tests

Write tests for:

- recording a check-in when the athlete exists and has fewer than 20 check-ins
- failing with `AthleteNotFound` when the athlete does not exist
- failing with `AthleteCheckInLimitReached` when there are already 20 check-ins
- listing check-ins for an existing athlete

## What To Notice

- You are testing business logic without touching real persistence.
- The architecture is easy to test because the dependencies are provided through layers.
- This is the concrete payoff of the DI structure you built earlier.
- The test is not proving that arrays or files work. It is proving that service rules work.

## Checkpoint

- `npm test` passes
- the tests use `Layer.mock(...)`
- the tests do not call HTTP routes

## Questions

- Why is `Layer.mock(...)` a better teaching tool here than a general-purpose mocking library?
- What does the test provide, and what does the test leave real?

## Manual Verification

- Run `npm test`.

## Common Mistake

- Re-testing repository behavior in service tests instead of mocking it.
