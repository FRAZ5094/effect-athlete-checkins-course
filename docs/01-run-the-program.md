# Stage 1: Run The Program

Goal: confirm the starter project runs before you touch the Effect code.

## Files To Look At

- `package.json`
- `src/main.ts`
- `src/program.ts`

## What To Do

1. Run:

```bash
npm install
npm run dev
```

2. Confirm you see the starter message in the terminal.
3. Read [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts).
4. Read [src/program.ts](/Users/fraser/Github/effect-learning/src/program.ts).

What you should notice:

- `main.ts` is the real entrypoint
- `program.ts` exports one Effect program
- nothing about HTTP is involved
- `Effect.runPromise(...)` is how the program gets executed

## Read These Files In This Order

1. [src/main.ts](/Users/fraser/Github/effect-learning/src/main.ts)
2. [src/program.ts](/Users/fraser/Github/effect-learning/src/program.ts)

That order helps because:

- `main.ts` shows how the runtime starts
- `program.ts` shows the Effect value that gets run

## Checkpoint

- `npm run dev` starts cleanly
- you know which file runs the program
- you know which file you will edit in stage 2

## Questions

- Which file calls `Effect.runPromise(...)`?
- Which file exports the program that gets run?
- What is the current starter output?

## Manual Verification

- Run `npm run dev`

## Common Mistake

- Starting stage 2 before confirming the starter project already runs

## If You Need Help

If the project does not start, ask Claude or GPT exactly what happened:

- what command you ran
- what output or error you saw
- which file you were reading

Keep the question about startup only. Do not jump ahead yet.
