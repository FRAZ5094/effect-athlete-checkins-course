export interface Athlete {
  readonly id: string
  readonly name: string
}

export interface CreateAthleteInput {
  readonly name: string
}

// TODO in docs/05-http-and-schema.md:
// Create an Effect Schema for CreateAthleteInput.
// Use Schema.NonEmptyTrimmedString for the name field.

