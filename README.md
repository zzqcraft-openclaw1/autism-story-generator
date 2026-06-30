# Autism Story Generator

This repository currently contains the planning and product-contract docs for the Autism Story Generator.

## Docs

- [Docs index](./docs/README.md)
- [MVP spec](./docs/mvp-spec.md)
- [Child profile schema](./docs/child-profile-schema.md)
- [Story output JSON schema](./docs/story-output-json-schema.md)
- [Caregiver UX flow](./docs/caregiver-ux-flow.md)
- [Implementation plan](./docs/implementation-plan.md)

## Current status

- Repo state: documentation phase only
- Phase 0 scaffold: not started yet
- Current focus: caregiver-first MVP definition, schemas, UX flow, and implementation sequencing

---

# Design Doc — Automatic Story Generation for Autism Kids

## 1. Project Summary

**Project name:** Automatic Story Generation for Autism Kids

**Goal:** Build a tool that generates interactive, calm, personalized stories for autistic children.

**Primary users:**
- parents
- therapists
- teachers

**Secondary user:**
- the child consuming the story

This project should start from a **caregiver-guided storytelling model**, not a fully open-ended freeform story generator.

---

## 2. Problem

Many autistic children benefit from stories that are:
- predictable
- emotionally clear
- low-chaos
- personalized to their interests and sensitivities
- useful for practicing real-life situations

Generic story tools are often poor fits because they can be:
- too abstract
- too overstimulating
- too linguistically ambiguous
- too emotionally noisy
- insufficiently tailored to the child

There is room for a tool that helps adults generate stories that are both:
- **engaging enough to hold attention**
- **structured enough to remain supportive**

---

## 3. Product Vision

Create a caregiver-facing tool that generates **interactive social and emotional learning stories** tailored to autistic children.

The tool should produce stories that feel:
- safe
- supportive
- gentle
- structured
- adaptable to the child’s needs

The child should be able to interact with the story through **simple, guided choices**, while the adult keeps control over tone, complexity, and suitability.

---

## 4. Design Principles

### 4.1 Predictability over novelty
The system should prefer coherent, stable, calming story structure over surprising or highly creative twists.

### 4.2 Clear emotional framing
Characters, actions, and consequences should be explained in simple and direct ways.

### 4.3 Personalization with guardrails
Stories should adapt to the child’s interests and needs, but never at the cost of clarity or emotional safety.

### 4.4 Adult review stays important
The tool should support, not replace, the judgment of caregivers, therapists, or teachers.

### 4.5 Low stimulation by default
Language, pacing, and branching should avoid unnecessary chaos.

---

## 5. Goals

### 5.1 MVP Goals
- generate short personalized stories
- support simple branching choices
- let adults specify the scenario/topic
- adapt language to reading/communication level
- keep tone calm and emotionally legible
- support autism-friendly structure

### 5.2 Content Goals
- social stories
- emotional regulation stories
- routine/transition stories
- school/daycare stories
- friendship/sharing/waiting stories
- sensory comfort and coping stories

### 5.3 Product Goals
- fast generation
- simple caregiver input flow
- editable output before use
- reusable saved templates

---

## 6. Non-Goals

These should **not** be the first version:
- fully freeform child-led RPG storytelling
- unrestricted chat with the model
- diagnosis or therapy replacement
- real-time emotional detection from the child
- highly complex game mechanics
- open social platform features

---

## 7. Users

### 7.1 Parent / Caregiver
Needs:
- quick story creation
- personalization to the child’s interests
- confidence that the story is safe and understandable
- help with transitions, routines, or difficult situations

### 7.2 Therapist
Needs:
- repeatable story structures
- targeted skill/situation practice
- editable content for sessions
- predictable outputs for clinical or support contexts

### 7.3 Teacher
Needs:
- classroom or individual-use stories
- support for routines, social expectations, and transitions
- simple setup with minimal time cost

### 7.4 Child
Needs:
- understandable language
- familiar themes/interests
- low-pressure interactivity
- emotional safety
- clear choices and outcomes

---

## 8. Core Use Cases

### Use Case A — Social situation preparation
A parent creates a story about going to the dentist, visiting school, or meeting a new person.

### Use Case B — Emotional regulation
A therapist creates a story about feeling overwhelmed, taking a break, or asking for help.

### Use Case C — Routine building
A teacher creates a story about lining up, cleaning up, waiting for a turn, or changing activities.

### Use Case D — Interest-based engagement
A caregiver creates a story using the child’s favorite topic (trains, animals, planets, vehicles, etc.) to teach a skill or situation.

---

## 9. Core Workflow

### 9.1 Caregiver input
Adult provides:
- child age range
- interests
- reading/communication level
- topic or situation
- target skill or lesson
- sensory or emotional considerations
- desired story length

### 9.2 Story generation
The tool creates:
- a short structured story
- a calm tone
- a small number of guided choices
- emotionally clear consequences
- supportive language

### 9.3 Adult review/edit
Adult can:
- regenerate
- shorten
- simplify
- edit wording
- remove unsuitable branches

### 9.4 Child interaction
Child reads, listens, or is guided through the story.

### 9.5 Save/reuse
Adult can save the story as a reusable template.

---

## 10. Story Structure Proposal

A default story structure could be:

1. **Setup**
   - who the child/character is
   - where they are
   - what is happening

2. **Feeling / challenge**
   - what feels hard, new, loud, confusing, or important

3. **Supportive framing**
   - what the character can do
   - what safe helpers or choices exist

4. **Simple choice**
   - choose between 2–3 calm options

5. **Outcome**
   - clear, gentle consequence
   - reinforce coping, understanding, or success

6. **Closing reassurance**
   - predictable wrap-up
   - comforting ending

---

## 11. Interaction Model

The interaction should be **guided branching**, not open chat.

### Recommended v0 interaction style
- 2–3 choices at a time
- no hidden traps
- no punitive endings
- no chaotic plot explosion
- choices should reinforce:
  - self-advocacy
  - regulation
  - understanding
  - problem-solving

Example choices:
- “Take a deep breath”
- “Ask for help”
- “Take a quiet break”

Not ideal:
- wild improvisational branches
- emotionally confusing reversals
- sarcastic or ambiguous outcomes

---

## 12. Personalization Inputs

Possible child profile fields:
- name or preferred character name
- age range
- preferred topics/interests
- reading level
- communication style
- sensory sensitivities
- preferred calming strategies
- common stress situations
- preferred story length

Important: profile fields should guide the generator, not overfit or stereotype the child.

---

## 13. Safety and Content Rules

The system should avoid:
- frightening imagery by default
- sudden emotional intensity
- sarcasm or figurative ambiguity when avoidable
- shame-based framing
- punishment-heavy endings
- moral confusion
- chaotic multi-threaded scenes

The system should prefer:
- direct language
- emotional labeling
- safe coping choices
- predictable consequences
- supportive adults/helpers
- calm endings

Human review should remain available before final use.

---

## 14. MVP Functional Requirements

### Required
- create story from structured inputs
- generate short branching story
- support simple edit/regenerate flow
- save story output
- export or present readable story format

### Nice to have
- read-aloud audio
- illustrations
- favorite templates
- topic presets
- therapist/teacher mode presets

---

## 15. MVP Technical Direction

A pragmatic v0 could be:
- **frontend:** simple web app
- **backend:** lightweight API service
- **generation:** LLM with structured prompting/templates
- **storage:** child profiles, saved templates, generated stories

Suggested system components:
1. profile builder
2. story prompt/template engine
3. safety/style constraint layer
4. branching story generator
5. editor/reviewer UI
6. story library

The first version should rely heavily on **prompt structure + validation**, not sophisticated agent autonomy.

---

## 16. Output Format Proposal

Each story output should include:
- title
- child profile summary used
- target skill/situation
- story body
- branch choices
- intended lesson
- caregiver note
- optional calming prompts

This helps keep the tool useful in parent, therapist, and classroom settings.

---

## 17. Success Criteria

A successful MVP should allow a caregiver to:
- create a personalized story in a few minutes
- understand the output immediately
- trust the story to be calm and appropriate
- reuse or edit stories easily
- use stories to support specific daily-life situations

Practical product success signs:
- caregivers save and reuse story templates
- stories are understandable without heavy rewriting
- branching feels useful but not chaotic
- stories help with transitions, social situations, or regulation moments

---

## 18. Risks

### Risk 1 — Too generic
If outputs feel bland or repetitive, caregivers may stop using it.

### Risk 2 — Too chaotic
If outputs become too “creative,” they may stop being autism-friendly.

### Risk 3 — Overpromising therapeutic value
The tool must support caregivers and professionals, not pretend to replace them.

### Risk 4 — Weak personalization
If child profiles do not meaningfully affect output, the tool loses value.

### Risk 5 — Safety mismatch
If story tone or wording is not consistently calm and clear, trust collapses fast.

---

## 19. Recommended MVP Slice

The best first version is probably:

**A web tool that generates short, editable, autism-friendly social stories with light branching for caregivers.**

Narrow initial scope:
- English only
- text first
- 3–5 minute story generation flow
- 2–3 branches maximum
- parent/therapist/teacher presets
- simple saved stories library

---

## 20. Future Extensions

After MVP, possible expansions:
- audio narration
- illustrated story cards
- visual schedule integration
- multi-language support
- stronger child profile adaptation
- progress tracking and story reuse analytics
- therapist content packs
- curriculum or routine bundles

---

## 21. Immediate Next Steps

1. define MVP scope more tightly
2. choose platform (web first is recommended)
3. define child profile schema
4. define story JSON/output schema
5. define prompt/safety template
6. sketch the caregiver input UI
7. create 5–10 example story scenarios for evaluation

---

## 22. Recommendation

Start with **guided social story generation**, not general storytelling.

That gives the project the best chance of being:
- useful
- safe
- understandable
- testable
- actually supportive for autistic children and the adults helping them
