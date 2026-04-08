import { randomUUID } from "node:crypto"
import { Effect } from "effect"
import type {
  AthleteRepositoryService
} from "../../application/AthleteRepository.js"
import type { Athlete, CreateAthleteInput } from "../../domain/Athlete.js"
import { readJsonFile, writeJsonFile } from "./jsonStore.js"

const athleteFileName = "athletes.json"

export const makeAthleteRepositoryJson = (): AthleteRepositoryService => {
  return {
    create: (input: CreateAthleteInput) =>
      Effect.promise(async () => {
        const athletes = await readJsonFile<Athlete[]>(athleteFileName)
        const athlete: Athlete = {
          id: randomUUID(),
          name: input.name
        }

        athletes.push(athlete)
        await writeJsonFile(athleteFileName, athletes)

        return athlete
      }),
    getById: (id: string) =>
      Effect.promise(async () => {
        const athletes = await readJsonFile<Athlete[]>(athleteFileName)
        return athletes.find((athlete) => athlete.id === id) ?? null
      }),
    getByName: (name: string) =>
      Effect.promise(async () => {
        const athletes = await readJsonFile<Athlete[]>(athleteFileName)
        return athletes.find((athlete) => athlete.name === name) ?? null
      }),
    list: () =>
      Effect.promise(async () => {
        return await readJsonFile<Athlete[]>(athleteFileName)
      })
  }
}

