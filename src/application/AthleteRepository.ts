import { Context, Layer, type Effect } from "effect"
import type { Athlete, CreateAthleteInput } from "../domain/Athlete.js"
import { makeAthleteRepositoryInMemory } from "../infrastructure/in-memory/AthleteRepositoryInMemory.js"
import { makeAthleteRepositoryJson } from "../infrastructure/json/AthleteRepositoryJson.js"

export interface AthleteRepositoryService {
  readonly create: (input: CreateAthleteInput) => Effect.Effect<Athlete>
  readonly getById: (id: string) => Effect.Effect<Athlete | null>
  readonly getByName: (name: string) => Effect.Effect<Athlete | null>
  readonly list: () => Effect.Effect<ReadonlyArray<Athlete>>
}

export class AthleteRepository extends Context.Tag("AthleteRepository")<
  AthleteRepository,
  AthleteRepositoryService
>() {
  static readonly InMemory = Layer.sync(this, makeAthleteRepositoryInMemory)
  static readonly Json = Layer.sync(this, makeAthleteRepositoryJson)
}

