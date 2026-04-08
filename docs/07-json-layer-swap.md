# Optional Stage 7: Swap To JSON Layers

Goal: see how little application code changes when you switch implementations.

## Files To Read

- `src/infrastructure/json/AthleteRepositoryJson.ts`
- `src/infrastructure/json/CheckInRepositoryJson.ts`
- `src/extensions/json-data/athletes.json`
- `src/extensions/json-data/check-ins.json`

## File To Edit

- `src/application/AppLive.ts`

## What To Do

In [src/application/AppLive.ts](/Users/fraser/Github/effect-learning/src/application/AppLive.ts), swap:

- `AthleteRepository.InMemory` -> `AthleteRepository.Json`
- `CheckInRepository.InMemory` -> `CheckInRepository.Json`

Do not change:

- route code
- service code
- domain code

That is the point of the exercise.

## Manual Verification

1. Start the server again.
2. Create an athlete.
3. Create one or two check-ins.
4. Open:
   - [athletes.json](/Users/fraser/Github/effect-learning/src/extensions/json-data/athletes.json)
   - [check-ins.json](/Users/fraser/Github/effect-learning/src/extensions/json-data/check-ins.json)
5. Confirm the data is now persisting there.

## What To Notice

- The service layer did not care which repository implementation was live.
- The HTTP layer did not change.
- The swap happened at the layer-composition boundary.

This is the most direct demonstration of why the dependency structure exists.

## Checkpoint

- The app still works after the layer swap.
- Data is stored in the JSON files.
- Only the composition layer changed.

## Questions

- Why is the swap localized to `AppLive`?
- What would have happened if your route handlers talked directly to arrays or files?

## Common Mistake

- Editing services or routes during the swap. If you need to do that, your boundaries are probably in the wrong place.

