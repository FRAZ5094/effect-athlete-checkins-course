import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import type {
  CheckInRepositoryService
} from "../../application/CheckInRepository.js"
import type { CheckIn, CreateCheckInInput } from "../../domain/CheckIn.js"

export const makeCheckInRepositoryInMemory = (): CheckInRepositoryService => {
  const checkIns: CheckIn[] = []

  return {
    create: (_athleteId: string, input: CreateCheckInInput) =>
      Effect.die(
        new Error(
          `TODO: create a check-in with id ${randomUUID()} and store it in memory with energy ${input.energy}`
        )
      ),
    listByAthleteId: (_athleteId: string) =>
      Effect.die(new Error("TODO: list check-ins for one athlete from memory")),
    countByAthleteId: (_athleteId: string) =>
      Effect.succeed(checkIns.length)
  }
}

