import { Context, Effect, Layer } from "effect"
import type { CheckIn, CreateCheckInInput } from "../domain/CheckIn.js"
import { AthleteRepository } from "./AthleteRepository.js"
import { CheckInRepository } from "./CheckInRepository.js"

export interface CheckInServiceService {
  readonly recordCheckIn: (
    athleteId: string,
    input: CreateCheckInInput
  ) => Effect.Effect<CheckIn>
  readonly listCheckIns: (
    athleteId: string
  ) => Effect.Effect<ReadonlyArray<CheckIn>>
}

export const makeCheckInService = Effect.gen(function* () {
  const athleteRepository = yield* AthleteRepository
  const checkInRepository = yield* CheckInRepository

  return {
    recordCheckIn: (_athleteId: string, input: CreateCheckInInput) =>
      Effect.die(
        new Error(
          `TODO: implement recordCheckIn using ${typeof athleteRepository}, ${typeof checkInRepository}, and energy ${input.energy}`
        )
      ),
    listCheckIns: (_athleteId: string) =>
      Effect.die(new Error("TODO: implement listCheckIns"))
  } satisfies CheckInServiceService
})

export class CheckInService extends Context.Tag("CheckInService")<
  CheckInService,
  CheckInServiceService
>() {
  static readonly Live = Layer.effect(this, makeCheckInService)
}
