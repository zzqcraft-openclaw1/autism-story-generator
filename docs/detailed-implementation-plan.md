# Detailed Implementation Plan

## 1. Recommended Tech Stack

### Frontend
- TypeScript
- Next.js
- React
- Tailwind CSS
- shadcn/ui or a similarly minimal component layer

### Why
- fast to scaffold
- excellent for form-heavy workflows
- strong TypeScript integration
- easy future deployment
- good fit for a caregiver-first product UI

---

## 2. Backend Approach

### Recommended MVP approach
Use a single **Next.js application** with:
- route handlers / server actions
- shared TypeScript contracts
- integrated frontend + backend

### Why
- fastest path to a coherent MVP
- avoids premature service splitting
- easier local development and deployment
- enough for profile CRUD, generation, review, and saved stories

### Future option
If scale or complexity grows later, split into:
- frontend app
- separate backend API service

But that is not needed now.

---

## 3. Database and ORM

### Database
- PostgreSQL

### ORM
- Prisma

### Why
- strong TypeScript support
- readable models and migrations
- fast MVP iteration
- good fit for CRUD + structured JSON fields

---

## 4. Validation and Contracts

### Validation library
- Zod

### Why
- ideal for shared schemas
- easy validation on both server and UI
- good fit for:
  - child profile schema
  - story request schema
  - story output schema

---

## 5. Testing Stack

- Vitest for unit/integration tests
- Playwright for critical UI flow tests
- optional React Testing Library for component behavior

---

## 6. Deployment Recommendation

### MVP deployment
- Vercel for app hosting
- managed Postgres (Supabase Postgres or another hosted Postgres)

### Why
- fast setup
- low ops burden
- enough for MVP experimentation

---

## 7. Architecture Shape

Recommended MVP architecture:
- single repo
- single Next.js app
- Prisma + Postgres
- generation service behind an internal interface

### Main modules
1. child profile module
2. story request module
3. generation module
4. review/edit module
5. story library module
6. safety/guardrail module

---

## 8. Suggested Repo Layout

- `app/` — app routes/pages
- `components/` — reusable UI
- `lib/` — shared utilities
- `lib/schemas/` — zod schemas
- `lib/story/` — generation pipeline and helpers
- `lib/db/` — db/prisma helpers
- `prisma/` — schema + migrations
- `docs/` — project docs
- `tests/` — unit/integration tests
- `e2e/` — Playwright tests

---

## 9. Data Model Plan

### Core tables
- `child_profiles`
- `story_requests`
- `generated_stories`
- `story_revisions` (optional but useful early)

### High-level stored data
- child profile attributes
- request parameters
- structured generated story JSON
- caregiver notes and review flags
- generation metadata

---

## 10. Phase Plan

## Phase 0 — Scaffold

### Goal
Set up the repo for real implementation.

### Tasks
- create Next.js + TypeScript app scaffold
- add Tailwind
- add Prisma
- add env/config structure
- add base repo layout
- add local run instructions

### Exit criteria
- app boots locally
- DB connection works
- lint/typecheck pass

---

## Phase 1 — Core Data Contracts

### Goal
Turn the docs into code-level schemas and validation.

### Tasks
- implement child profile schema in code
- implement story request schema in code
- implement story output schema in code
- add validation helpers
- add fixture examples
- add tests

### Exit criteria
- schemas compile cleanly
- valid fixtures pass
- invalid fixtures fail as expected

---

## Phase 2 — Child Profile Management

### Goal
Create and reuse child profiles.

### Tasks
- child profile CRUD API
- DB model + migration
- basic profile form UI
- advanced fields split/collapsible
- tests for save/load/edit

### Exit criteria
- caregiver can create and edit a profile through UI

---

## Phase 3 — Story Request Flow

### Goal
Create the caregiver request form.

### Tasks
- profile selection
- topic/situation input
- target skill input
- story length selection
- optional tone/avoid inputs
- preset scenarios

### Exit criteria
- caregiver can submit a structured request

---

## Phase 4 — Story Generation Engine v1

### Goal
Generate valid structured story JSON.

### Tasks
- prompt builder
- generation service interface
- provider integration
- schema validation
- retry/repair on malformed output
- enforce branch limits and caregiver note presence

### Exit criteria
- system can generate valid structured story output consistently for core scenarios

---

## Phase 5 — Safety and Content Guardrails

### Goal
Improve output safety and reviewability.

### Tasks
- content/style checks
- review flags
- branch cap enforcement
- required caregiver note
- block clearly malformed/unsafe outputs

### Exit criteria
- output quality is safer and easier to review before use

---

## Phase 6 — Review / Edit Experience

### Goal
Make the generated output usable by caregivers.

### Tasks
- review screen
- separate child-facing story from caregiver note
- expose branches clearly
- regenerate
- simplify/shorten
- manual edit support

### Exit criteria
- caregiver can inspect and refine story before use

---

## Phase 7 — Save / Reuse Library

### Goal
Make stories reusable.

### Tasks
- save story
- list saved stories
- reopen/edit story
- duplicate story
- archive/delete support

### Exit criteria
- caregiver can build a reusable story library

---

## Phase 8 — Export / Presentation

### Goal
Make stories easy to use outside the editor.

### Tasks
- copy plain text
- printable story view

### Exit criteria
- story can be used in real-world caregiver workflows without friction

---

## Phase 9 — Evaluation and Refinement

### Goal
Evaluate whether outputs are actually useful.

### Tasks
- fixed evaluation scenarios
- manual story reviews
- identify repeated failure patterns
- refine prompts and guardrails

### Exit criteria
- measured quality improvement loop exists

---

## 11. Recommended Build Order

1. scaffold
2. schemas and validation
3. child profile CRUD
4. story request form
5. generation engine
6. safety checks
7. review/edit UI
8. story library
9. export
10. evaluation loop

---

## 12. First Two Milestones

### Milestone 1
Child profile + request + valid story JSON generation

### Milestone 2
Review/edit/save loop working in UI

---

## 13. Prompting Strategy

Use a structured template-driven generation approach.

Prompt should include:
- child profile summary
- story request
- safety/tone rules
- required JSON output shape
- branch limits
- caregiver review expectations

Do not rely on freeform chat-style responses.

---

## 14. Safety Implementation Focus

For MVP, safety should focus on:
- structure safety
- tone safety
- caregiver review safety

### Examples
- valid schema only
- limited branches
- caregiver note required
- review flags surfaced clearly
- avoid harsh or chaotic content by default

---

## 15. Development Workflow Recommendation

Workspace rule applies:
- coder implements
- coder may commit locally for review
- arbitor reviews exact diff/commit
- only after arbitor approval is the change ready to push

Keep change units small and scoped.

---

## 16. Immediate Next Tasks

If starting implementation now:
1. scaffold Phase 0 repo/app structure
2. create code-level schemas from docs
3. add example fixtures
4. create a generation stub route returning validated fixture JSON

---

## 17. Recommendation

Treat this as a structured caregiver product, not an AI novelty app.

Optimize for:
- predictable contracts
- safe outputs
- reviewability
- fast caregiver workflow
- iterative testing and refinement
