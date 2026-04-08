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

## Questions

- Why keep the app layer composition in one file?
- What would need to change if you later swapped one repository implementation?

## Manual Verification

- Run `npm run typecheck`.

## Common Mistake

- Returning the total number of check-ins across all athletes from `countByAthleteId`.

