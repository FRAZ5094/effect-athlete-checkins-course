# Effect Athlete Check-ins Course

This version starts with a single runnable `Effect` program and only introduces `Context.Tag`, `Layer`, and service wiring after the basic Effect mental model is comfortable.

## Get Your Own Copy

1. Open this repository on GitHub.
2. Click `Fork` to create your own copy under your GitHub account.
3. Clone your fork:

```bash
git clone https://github.com/<your-github-username>/effect-athlete-checkins-course.git
cd effect-athlete-checkins-course
```

## Install And Run

```bash
npm install
npm run dev
```

You should see a simple starter message in the terminal.

## Read The Guides In VS Code

Open this folder in VS Code, then open any file in `docs/`.

To preview markdown nicely on Mac:

- Press `Cmd+Shift+V`
- Or click the preview icon in the top-right corner of the editor

## Start Here

Begin with [docs/00-primer.md](/Users/fraser/Github/effect-learning/docs/00-primer.md), then continue through the numbered files in order.

The course now progresses like this:

1. Run one small Effect program in `src/main.ts`
2. Learn `Effect.succeed`, `Effect.gen`, tagged errors, and `catchTag`
3. Build the athlete repository
4. Build the check-in repository and call both repositories directly from one program
5. Introduce services, `Context.Tag`, `Layer`, and `AppLive`
6. Unit test the services with `Layer.mock(...)`
7. Swap the repository implementation from memory to JSON

## How To Work Through The Course

- Only work on one stage at a time.
- Do not skip ahead if the current stage still feels fuzzy.
- Read the examples in the current doc before editing code.
- When a type signature is doing important teaching work, hover it in VS Code and inspect the full TypeScript type.
- Keep `npm run dev`, `npm run typecheck`, and later `npm test` nearby.
- Stay in the current stage's files. Do not redesign the repo while learning.

## If You Get Stuck

Ask Claude or GPT for help inside this repo.

- Ask about the current stage only.
- Say which file you are editing.
- Say what feels confusing.
- Ask for coaching first, not the full answer immediately.

Example questions:

- "I am in stage 2, working in `src/main.ts`. Can you explain how the generator should flow?"
- "I am in stage 5, working in `src/application/AthleteService.ts`. Can you review whether my tagged errors are in the right place?"

If the issue is specifically `Context.Tag`, `Layer`, or `Effect.provide(...)` wiring, ask it to fix that part directly so you can stay focused on the learning goal.

The repo includes [AGENTS.md](/Users/fraser/Github/effect-learning/AGENTS.md) and [CLAUDE.md](/Users/fraser/Github/effect-learning/CLAUDE.md) with guidance for how the assistant should help you.
