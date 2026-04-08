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
- The server setup is already in place.

## Read These Files In This Order

1. [src/server.ts](/Users/fraser/Github/effect-learning/src/server.ts)
2. [src/app.ts](/Users/fraser/Github/effect-learning/src/app.ts)
3. [src/http/routes/athletes.ts](/Users/fraser/Github/effect-learning/src/http/routes/athletes.ts)

That order helps because:

- `server.ts` shows how the app starts
- `app.ts` shows how routes are mounted
- `athletes.ts` shows where the unfinished work lives

## Checkpoint

- The dev server starts.
- `GET /` returns `Hello World`.
- You know where the route placeholders live.
- You know which files matter first and which files can wait.

## Questions

- Which file creates the `Hono` app?
- Which file starts the Node server?
- Which file contains the unfinished athlete routes?

## Manual Verification

- Visit `http://localhost:3000`.

## Common Mistake

- Starting to implement route logic before confirming the shell is running.

## If You Need Help

If the app does not start, ask Claude or GPT exactly what happened:

- what command you ran
- what output or error you saw
- which file you were looking at

Keep the question about startup only. Do not jump ahead to later stages yet.
