# What Next In Effect

You only used a small part of Effect in this repo. Here are other backend-focused features worth learning next.

## 1. Branded Types

Use branded types when you want stronger type distinctions such as `AthleteId` versus a general `string`.

## 2. Schema

You used basic request decoding here. `Schema` also helps with transformations, richer validation, and encoded versus decoded data shapes.

## 3. Option

Use `Option` when a value may be absent and you want to model that explicitly instead of reaching for `null` everywhere.

## 4. Either

Use `Either` for synchronous success/failure modeling when you do not need the full power of `Effect`.

## 5. Config

Use `Config` to load and validate environment variables and application settings.

## 6. Logger

Use Effect logging to keep logs structured and consistent across your app.

## 7. Metrics

Metrics help you answer questions like how often an operation runs, how long it takes, and how often it fails.

## 8. Tracing

Tracing helps you follow a request or workflow across many operations so you can see where time is spent and where failures happen.

## 9. Schedule

Use schedules for retries, repetition, backoff policies, and time-based control flow.

## 10. Scoped Resources

Use scopes when you need reliable acquisition and cleanup for things like connections, files, or long-lived resources.

## 11. Fiber

Fibers are lightweight concurrent units of execution. They make cancellation and structured concurrency much easier to reason about.

## 12. Queue

Queues help coordinate producer and consumer workflows safely inside your application.

## 13. PubSub

PubSub gives you a simple way to fan out events to multiple subscribers.

## 14. Stream

Streams are useful when you want to process sequences of values over time rather than one value at a time.

## 15. HTTP Modules

Effect also has HTTP tools beyond this course. Those become more useful once the core mental model is comfortable.

## Suggested Next Steps

- Revisit this repo and add branded ids.
- Add structured logging around service calls.
- Add metrics around `createAthlete` and `recordCheckIn`.
- Read more about tracing and how it helps in larger backend systems.
- Explore the Effect HTTP modules after the core service/layer model feels natural.
