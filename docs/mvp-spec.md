# MVP Spec — Autism Story Generator

## 1. Purpose

This MVP should validate that we can generate **safe, useful, personalized, interactive stories** for autistic children in a caregiver-guided workflow.

The goal of the MVP is not to build a full learning platform.
The goal is to prove that a focused story-generation tool can produce outputs that are:
- calm
- understandable
- editable
- reusable
- supportive in real situations

---

## 2. MVP Product Definition

**MVP product:**
A caregiver-facing web tool that generates short autism-friendly interactive stories from structured inputs.

**Primary operator:**
- parent
- therapist
- teacher

**End consumer:**
- autistic child

**Output style:**
- short story
- guided branching choices
- clear emotional framing
- safe and predictable structure

---

## 3. MVP Goals

The MVP must prove these core things:

1. adults can create a usable story quickly
2. stories can be personalized to a child profile and scenario
3. outputs remain calm and structured
4. branching is simple and supportive, not chaotic
5. adults can review/edit before using the story
6. generated stories are reusable later

---

## 4. MVP Non-Goals

The MVP will not include:
- open-ended chat with the child
- unrestricted story improvisation
- child accounts or social features
- therapist analytics dashboards
- diagnosis, therapy claims, or automated intervention recommendations
- advanced voice/avatar interaction
- image generation as a required part of the core experience
- classroom fleet/admin tools

These can come later if the core story workflow proves valuable.

---

## 5. Primary User Stories

### Story 1 — Parent creates a social story
A parent wants a story about going to a new place, waiting in line, or asking for help.

### Story 2 — Therapist creates a regulation story
A therapist wants a story about calming down, taking a break, or naming a feeling.

### Story 3 — Teacher creates a transition story
A teacher wants a story about classroom routines, group time, or moving between activities.

### Story 4 — Adult reuses and adapts a prior story
A caregiver wants to regenerate or edit a story instead of starting from scratch.

---

## 6. MVP Workflow

### Step 1 — Create or choose a child profile
Required fields for v0:
- display name or character name
- age range
- interests
- reading/communication level

Optional v0 fields:
- sensory sensitivities
- calming preferences
- common difficult situations

### Step 2 — Enter the story request
Required fields:
- situation/topic
- target skill or lesson
- story length

Optional fields:
- setting
- preferred emotional tone
- things to avoid

### Step 3 — Generate a story
The system produces:
- title
- short story body
- 2–3 guided choices
- caregiver note
- intended lesson

### Step 4 — Review and edit
Adult can:
- regenerate
- simplify
- shorten
- edit text manually
- remove unsuitable branches

### Step 5 — Save story
Adult can save the story to a library for reuse.

### Step 6 — Present story
Story can be read directly in the UI or copied/exported as plain text.

---

## 7. MVP Feature Set

### 7.1 Required Features

#### A. Child profile creation
- create profile
- edit profile
- save profile

#### B. Structured story request form
- select or enter topic
- select target skill
- choose story length
- include child interests and preferences

#### C. Story generation engine
- generate one structured story
- include 2–3 simple branches
- include intended lesson
- include caregiver note

#### D. Safety/style constraint layer
- autism-friendly tone rules
- calm language rules
- avoid punitive or chaotic branches
- reduce ambiguity where possible

#### E. Review/edit screen
- show full story clearly
- support manual edits
- support regenerate

#### F. Save/reuse library
- save a story
- list saved stories
- reopen an existing story
- duplicate/edit a prior story

#### G. Export/copy
- copy as plain text
- simple printable view

---

## 8. Recommended Story Output Schema

Each generated story should contain at least:

- `title`
- `child_profile_summary`
- `topic`
- `target_skill`
- `story_text`
- `choices[]`
- `lesson_summary`
- `caregiver_note`
- `tone_tags[]`
- `warnings_or_review_flags[]`

Each choice should contain:
- `label`
- `prompt`
- `outcome_text`

---

## 9. Content Rules for MVP

The system should prefer:
- direct language
- calm pacing
- explicit emotional naming
- gentle reassurance
- helpful adults/helpers
- simple sequences
- predictable endings

The system should avoid:
- frightening imagery by default
- sarcasm
- emotional whiplash
- punishment-heavy outcomes
- shame language
- highly abstract metaphor when unnecessary
- more than 2–3 branches in MVP

---

## 10. UX Requirements

### Must be easy for adults
- the form should be short
- first story generation should take only a few minutes
- review/edit should feel obvious

### Must be easy to inspect
- generated story should be readable in one view
- branches should not be hidden
- caregiver note should be separate from child-facing text

### Must feel safe
- no “surprising chaos” in UI or content
- obvious regenerate/edit controls
- clear signal that adult review is expected

---

## 11. Technical MVP Recommendation

### Frontend
- lightweight web app
- form-driven UI
- story review/editor screen

### Backend
- simple API
- story generation endpoint
- profile CRUD
- saved story CRUD

### Storage
- child profiles
- saved stories
- generation metadata

### Generation approach
- structured prompt templates
- response validation
- post-processing for safety/style enforcement

This MVP should optimize for clarity and control, not agent complexity.

---

## 12. MVP Success Criteria

The MVP is successful if:
- an adult can generate a useful story in under 5 minutes
- the story is understandable without heavy rewriting
- branching feels helpful, not chaotic
- the tool can produce stories for several common scenarios
- adults choose to save/reuse stories
- outputs are consistently calm and appropriate

---

## 13. Evaluation Scenarios

We should test the MVP against a fixed scenario set such as:
- going to the doctor
- waiting for a turn
- asking for help
- trying a new food
- transitioning from playtime to bedtime
- coping with loud noise
- meeting a new teacher

Each scenario should be reviewed for:
- clarity
- calmness
- personalization quality
- branch usefulness
- emotional safety

---

## 14. Key Risks in MVP

### Risk: stories too generic
Mitigation:
- strengthen interest-based personalization

### Risk: stories too chaotic
Mitigation:
- hard-limit branch count
- stronger style templates

### Risk: stories too verbose
Mitigation:
- default short form
- explicit length control

### Risk: adult trust is low
Mitigation:
- keep caregiver note and review step explicit
- surface simple output structure

---

## 15. MVP Build Order

Recommended implementation order:

1. child profile schema
2. story request form
3. structured prompt/output format
4. generation endpoint
5. review/edit UI
6. save/reuse story library
7. export/print view
8. polish and evaluation scenarios

---

## 16. Recommendation

Build the MVP as a **small, controlled, caregiver-first web app**.

Do not start by optimizing for novelty.
Optimize for:
- safety
- clarity
- speed
- personalization
- repeatability

If the MVP works, then we can later expand into:
- audio
- visuals
- richer branching
- therapist toolkits
- classroom workflows
