# Stage 1: Run The App

Goal: confirm the starter project works before you touch the Effect code.

## Files To Look At

- `package.json`
- `src/server.ts`
- `src/app.ts`
- `src/http/routes/athletes.ts`

## What To Do

1. Run:

```bash
npm install
npm run dev
```

2. Open `http://localhost:3000`.
3. Confirm the response is `Hello World`.
4. Read [src/app.ts](/Users/fraser/Github/effect-learning/src/app.ts) and [src/http/routes/athletes.ts](/Users/fraser/Github/effect-learning/src/http/routes/athletes.ts).

What you should notice:

- `Hono` is already set up.
- The root route already works.
- The athlete routes already exist, but the handlers are placeholders.
- You are not being asked to set up the server yourself.

## Why This Stage Exists

You want to start from a known-good base. If the server does not run, everything else becomes noise.

## Checkpoint

- The dev server starts.
- `GET /` returns `Hello World`.
- You know where the route placeholders live.

## Questions

- Which file creates the `Hono` app?
- Which file starts the Node server?
- Which file contains the unfinished athlete routes?

## Manual Verification

- Visit `http://localhost:3000`.

## Common Mistake

- Starting to implement route logic before confirming the shell is running.

