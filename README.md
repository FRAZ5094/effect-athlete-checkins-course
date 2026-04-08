# Effect Athlete Check-ins Course

Start here.

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

Then open `http://localhost:3000` and make sure you see `Hello World`.

## Read The Guides In VS Code

Open this folder in VS Code, then open any file in `docs/`.

To preview the markdown nicely on Mac:

- Press `Cmd+Shift+V`
- Or click the preview icon in the top-right corner of the editor

## Start Here

Begin with [docs/00-primer.md](/Users/fraser/Github/effect-learning/docs/00-primer.md), then continue in order through the numbered files.

## How To Work Through The Course

- Only work on one stage at a time.
- Do not skip ahead if the current stage still feels fuzzy.
- At the start of each stage, read the opening explanation and examples before editing code.
- Keep `npm run dev` and `npm run typecheck` nearby while you work.
- If you get stuck, compare your code to the non-answer examples in the current stage before asking for help.

## If You Get Stuck

Ask Claude or GPT for help inside this repo.

- Ask about the current stage only.
- Say which file you are working in.
- Say what feels confusing.
- Ask for coaching first, not the full answer immediately.

Example questions:

- "I am in stage 2, working in `AthleteRepositoryInMemory.ts`. Can you explain what should live inside the factory?"
- "I am in stage 5, working in `athletes.ts`. Can you explain the route flow without rewriting the whole file?"

If the issue is specifically `Hono` wiring or `Effect` integration with `Hono`, ask it to fix that part directly so you can stay focused on the course.

The repo includes [AGENTS.md](/Users/fraser/Github/effect-learning/AGENTS.md) and [CLAUDE.md](/Users/fraser/Github/effect-learning/CLAUDE.md) with guidance for how the assistant should help you.
