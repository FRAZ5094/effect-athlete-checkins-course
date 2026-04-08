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

## Questions

- Why is the repository a `Context.Tag` instead of a plain exported object?
- Why is the array created inside `makeAthleteRepositoryInMemory`?

## Manual Verification

- Run `npm run typecheck`.

## Common Mistake

- Putting business rules such as duplicate-name checking into the repository. That belongs in the service layer later.

