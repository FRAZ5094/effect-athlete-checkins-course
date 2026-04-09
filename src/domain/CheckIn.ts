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
