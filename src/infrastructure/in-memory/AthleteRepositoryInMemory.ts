import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import type {
  AthleteRepositoryService
} from "../../application/AthleteRepository.js"
import type { Athlete, CreateAthleteInput } from "../../domain/Athlete.js"

export const makeAthleteRepositoryInMemory = (): AthleteRepositoryService => {
  const athletes: Athlete[] = []

  return {
    create: (input: CreateAthleteInput) =>
      Effect.die(
        new Error(
          `TODO: create an athlete with id ${randomUUID()} and store it in memory for ${input.name}`
        )
      ),
    getById: (_id: string) =>
      Effect.die(new Error("TODO: look up an athlete by id from memory")),
    getByName: (_name: string) =>
      Effect.die(new Error("TODO: look up an athlete by name from memory")),
    list: () =>
      Effect.succeed(athletes)
  }
}

