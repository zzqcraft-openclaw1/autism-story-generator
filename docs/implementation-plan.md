# Implementation Plan

## 1. Purpose

This plan turns the current design docs into a practical build sequence for the Autism Story Generator MVP.

The goal is to move from concept to a working caregiver-facing prototype without trying to solve everything at once.

---

## 2. Current Inputs

The project already has:
- overall design doc
- MVP spec
- story output JSON schema
- child profile schema
- caregiver UX flow

This implementation plan assumes those docs are the current source of truth.

---

## 3. Implementation Strategy

Build the MVP in layers:

1. **contracts first**
   - lock schemas and data shapes
2. **thin backend**
   - implement storage and generation endpoints
3. **simple frontend**
   - implement caregiver workflow screens
4. **generation safety loop**
   - validate structured output and enforce guardrails
5. **evaluation pass**
   - test against fixed scenarios and refine

This should stay intentionally small and controlled.

---

## 4. Recommended MVP Tech Direction

### Frontend
- web app
- simple form-based UI
- readable review/edit screen

### Backend
- lightweight API service
- CRUD for child profiles and saved stories
- story generation endpoint
- validation layer for generated story JSON

### Storage
- local DB or hosted relational DB
- child profiles
- saved stories
- generation metadata

### Generation layer
- prompt templates
- structured JSON output contract
- validation + repair/retry logic

### Suggested implementation mindset
Favor boring, reliable structure over clever agent complexity.

---

## 5. Phase Plan

## Phase 0 — Project Scaffold

### Goal
Set up the repo so implementation can start cleanly.

### Tasks
- choose stack
- create frontend/backend app structure
- set up linting/formatting
- set up env/config pattern
- add docs index and repo README links
- define local run instructions

### Deliverable
A runnable empty app scaffold with docs and developer workflow.

---

## Phase 1 — Core Data Contracts

### Goal
Turn the docs into code-level schemas.

### Tasks
- implement child profile schema in code
- implement story request schema in code
- implement story output schema in code
- implement validation rules
- create fixture examples

### Deliverable
Typed validated schema layer with test fixtures.

### Why first
This anchors both UI and generation.

---

## Phase 2 — Child Profile Management

### Goal
Make profiles usable before story generation.

### Tasks
- create child profile create/edit API
- store profiles in DB
- build child profile UI
- implement basic vs advanced profile form split
- test save/load/edit behavior

### Deliverable
Caregiver can create and reuse child profiles.

---

## Phase 3 — Story Request Flow

### Goal
Build the caregiver input workflow for requesting a story.

### Tasks
- story request form UI
- topic preset support
- target skill selection
- story length selection
- optional tone/avoid fields
- connect selected child profile to request

### Deliverable
Caregiver can submit a structured story request.

---

## Phase 4 — Story Generation Engine v1

### Goal
Generate structured stories reliably.

### Tasks
- create prompt templates
- call LLM backend
- require JSON-structured response
- validate response against schema
- retry/repair on malformed output
- enforce branch limits
- enforce caregiver note presence

### Deliverable
System generates a valid structured story object.

### Important note
This is the first “real product” milestone.

---

## Phase 5 — Safety and Content Guardrails

### Goal
Reduce unsafe or low-quality outputs before caregiver review.

### Tasks
- add style constraint checks
- block chaotic branching
- flag problematic content
- enforce calm language expectations where possible
- populate `review_flags`
- ensure caregiver note is present and meaningful

### Deliverable
Generated stories are safer and more reviewable.

---

## Phase 6 — Review / Edit Experience

### Goal
Make the output usable by caregivers.

### Tasks
- build story review screen
- separate child-facing story from caregiver note
- expose branches clearly
- enable regenerate whole story
- enable simplify/shorten actions
- enable manual edit
- preserve story structure after edits where possible

### Deliverable
Caregiver can inspect and refine the generated story before use.

---

## Phase 7 — Save / Reuse Library

### Goal
Make the product reusable, not one-off.

### Tasks
- save generated story
- list saved stories
- reopen story
- duplicate story
- basic archive/delete support

### Deliverable
Caregiver can build a reusable story library.

---

## Phase 8 — Export / Presentation

### Goal
Make stories easy to use outside the editor.

### Tasks
- copy plain text
- simple printable view
- readable story layout

### Deliverable
Caregiver can easily use the story in real situations.

---

## Phase 9 — Evaluation and Refinement

### Goal
Check whether outputs are actually useful.

### Tasks
- create scenario evaluation set
- generate stories for common use cases
- manually review for clarity/calmness/usefulness
- identify repeated quality failures
- refine prompts and guardrails

### Deliverable
A more stable MVP with evidence-based refinements.

---

## 6. Recommended Build Order Summary

The practical order is:

1. repo/app scaffold
2. schemas and validation
3. child profile CRUD + UI
4. story request form
5. story generation JSON contract
6. safety checks
7. review/edit screen
8. story library
9. export
10. evaluation loop

---

## 7. Testing Plan

### Unit tests
- schema validation
- profile validation
- story output validation
- branch count limits
- review flag rules

### Integration tests
- create profile -> request story -> generate -> validate -> save
- regenerate flow
- edit/save/reopen flow

### Manual evaluation tests
- doctor visit
- bedtime transition
- waiting turn
- asking for help
- new classroom situation
- loud environment coping

### Quality checklist
For every sample story, check:
- understandable language
- calm tone
- branch clarity
- emotional safety
- usefulness of caregiver note

---

## 8. First Engineering Milestone

The first meaningful milestone should be:

**A caregiver can create a child profile, request a story, and receive a valid structured story JSON object.**

Not pretty yet. Just functional and valid.

That milestone proves the core contract works.

---

## 9. Second Engineering Milestone

**A caregiver can review, edit, and save a story through a basic web UI.**

That milestone proves the product is becoming usable, not just technically correct.

---

## 10. Out-of-Scope for Early Implementation

Avoid early distraction from:
- advanced animations
- child-facing open chat
- elaborate role systems
- multiplayer/collaboration
- analytics dashboards
- image/audio generation as required core dependencies
- large-scale admin tools

These are easy to imagine and easy to bloat the project with.

---

## 11. Risks During Implementation

### Risk: schemas too loose
Mitigation:
- validate aggressively
- keep output structure explicit

### Risk: generation too inconsistent
Mitigation:
- strong prompt templates
- retry/repair logic
- evaluation scenarios

### Risk: UI too heavy for caregivers
Mitigation:
- keep the fast path short
- hide advanced options by default

### Risk: story editing breaks structure
Mitigation:
- separate editable text from structural metadata carefully

### Risk: feature creep
Mitigation:
- keep returning to MVP goals and non-goals

---

## 12. Suggested Immediate Next Tasks

If implementation starts now, the very next tasks should be:

1. choose stack and scaffold repo
2. create code-level schemas from the docs
3. create example fixtures for:
   - child profile
   - story request
   - story output
4. build the first generation endpoint stub

---

## 13. Recommendation

Do not treat this as an “AI toy app.”
Treat it as a **structured content product for caregivers**.

That means the implementation should prioritize:
- predictable contracts
- safe outputs
- reviewability
- fast caregiver workflows
- iterative quality testing

If we hold that line, the MVP has a real chance of being useful.
