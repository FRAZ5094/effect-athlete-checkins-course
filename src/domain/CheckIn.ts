export interface CheckIn {
  readonly id: string
  readonly athleteId: string
  readonly bodyweightKg: number | null
  readonly energy: number
  readonly notes: string | null
}

export interface CreateCheckInInput {
  readonly bodyweightKg?: number | null
  readonly energy: number
  readonly notes?: string | null
}

// TODO in docs/05-http-and-schema.md:
// Create an Effect Schema for CreateCheckInInput.
// Keep bodyweightKg optional/nullable, require energy in the range 0-10,
// and keep notes optional/nullable.

