# Primer

This repo teaches a small slice of Effect by building a backend API for athlete check-ins.

You do not need to understand the whole library up front. For this course, keep these ideas in mind:

- An `Effect` is a description of work. It does not run until you run it.
- A `Context.Tag` gives a name and a type to a dependency.
- A `Layer` provides an implementation for one or more tags.
- A service holds business logic.
- A repository holds persistence logic.
- Tagged errors are plain values you can return and pattern match on.

In this repo the split is:

- `Hono` handles HTTP.
- `Schema` decodes unknown request data into typed input.
- Services hold business rules.
- Repositories store and fetch data.
- `Layer` wires the implementations together.

That is enough for now. The deeper explanations happen in the stages where you actually use each piece.

## Checkpoint

- You know that this course is about composing a few core Effect ideas, not learning every module.
- You know that HTTP stays thin and the business logic lives elsewhere.

## Questions

- What is the difference between a service and a repository in this repo?
- What is a `Layer` responsible for?

## Manual Verification

- Read the file once in markdown preview.

## Common Mistake

- Trying to understand all of Effect before writing any code. You do not need that for this course.

