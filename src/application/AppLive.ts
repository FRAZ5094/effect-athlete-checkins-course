import { Layer } from "effect"

// TODO in docs/05-services-context-and-layers.md:
// Keep this file as the single place where the live application layers are composed.
// Start with the in-memory repository implementations.
// In the optional extension, swap the in-memory layers for the JSON ones.
export const AppLive = Layer.empty
