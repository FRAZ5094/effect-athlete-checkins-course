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

## What To Notice

- The repository does not know the business rules.
- The service reads like application behavior.
- Errors are values, not thrown exceptions.

This is one of the core reasons Effect codebases stay testable and predictable.

## Checkpoint

- Services depend on repositories through `Context.Tag`.
- Known failures are represented as tagged errors.
- The duplicate-name and max-check-in rules live in services, not repositories.

## Questions

- Why does `DuplicateAthleteName` belong in `AthleteService` instead of `AthleteRepository`?
- Why is `AthleteNotFound` useful as a tagged error instead of a thrown exception?

## Manual Verification

- Run `npm run typecheck`.

## Common Mistake

- Checking name uniqueness without trimming first.

