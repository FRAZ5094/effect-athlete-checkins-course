import { randomUUID } from "node:crypto"
import { Effect } from "effect"
import type {
  CheckInRepositoryService
} from "../../application/CheckInRepository.js"
import type { CheckIn, CreateCheckInInput } from "../../domain/CheckIn.js"
import { readJsonFile, writeJsonFile } from "./jsonStore.js"

const checkInFileName = "check-ins.json"

export const makeCheckInRepositoryJson = (): CheckInRepositoryService => {
  return {
    create: (athleteId: string, input: CreateCheckInInput) =>
      Effect.promise(async () => {
        const checkIns = await readJsonFile<CheckIn[]>(checkInFileName)
        const checkIn: CheckIn = {
          id: randomUUID(),
          athleteId,
          bodyweightKg: input.bodyweightKg ?? null,
          energy: input.energy,
          notes: input.notes ?? null
        }

        checkIns.push(checkIn)
        await writeJsonFile(checkInFileName, checkIns)

        return checkIn
      }),
    listByAthleteId: (athleteId: string) =>
      Effect.promise(async () => {
        const checkIns = await readJsonFile<CheckIn[]>(checkInFileName)
        return checkIns.filter((checkIn) => checkIn.athleteId === athleteId)
      }),
    countByAthleteId: (athleteId: string) =>
      Effect.promise(async () => {
        const checkIns = await readJsonFile<CheckIn[]>(checkInFileName)
        return checkIns.filter((checkIn) => checkIn.athleteId === athleteId)
          .length
      })
  }
}

