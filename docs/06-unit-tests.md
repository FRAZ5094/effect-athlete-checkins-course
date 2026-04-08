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

