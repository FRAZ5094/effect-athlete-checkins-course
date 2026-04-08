import { Context, Effect, Layer } from "effect"
import type { Athlete, CreateAthleteInput } from "../domain/Athlete.js"
import { AthleteRepository } from "./AthleteRepository.js"

export interface AthleteServiceService {
  readonly createAthlete: (input: CreateAthleteInput) => Effect.Effect<Athlete>
  readonly getAthlete: (id: string) => Effect.Effect<Athlete>
}

export const makeAthleteService = Effect.gen(function* () {
  const athleteRepository = yield* AthleteRepository

  return {
    createAthlete: (input: CreateAthleteInput) =>
      Effect.die(
        new Error(
          `TODO: implement createAthlete using ${typeof athleteRepository} for ${input.name}`
        )
      ),
    getAthlete: (_id: string) =>
      Effect.die(new Error("TODO: implement getAthlete"))
  } satisfies AthleteServiceService
})

export class AthleteService extends Context.Tag("AthleteService")<
  AthleteService,
  AthleteServiceService
>() {
  static readonly Live = Layer.effect(this, makeAthleteService)
}
