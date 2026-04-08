import { Context, Layer, type Effect } from "effect"
import type { CheckIn, CreateCheckInInput } from "../domain/CheckIn.js"
import { makeCheckInRepositoryInMemory } from "../infrastructure/in-memory/CheckInRepositoryInMemory.js"
import { makeCheckInRepositoryJson } from "../infrastructure/json/CheckInRepositoryJson.js"

export interface CheckInRepositoryService {
  readonly create: (
    athleteId: string,
    input: CreateCheckInInput
  ) => Effect.Effect<CheckIn>
  readonly listByAthleteId: (
    athleteId: string
  ) => Effect.Effect<ReadonlyArray<CheckIn>>
  readonly countByAthleteId: (athleteId: string) => Effect.Effect<number>
}

export class CheckInRepository extends Context.Tag("CheckInRepository")<
  CheckInRepository,
  CheckInRepositoryService
>() {
  static readonly InMemory = Layer.sync(this, makeCheckInRepositoryInMemory)
  static readonly Json = Layer.sync(this, makeCheckInRepositoryJson)
}

