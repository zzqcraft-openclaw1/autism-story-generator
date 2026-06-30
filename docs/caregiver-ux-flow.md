# Caregiver UX Flow

## 1. Purpose

This document describes the caregiver-facing user experience for the Autism Story Generator MVP.

The goal is to make story creation feel:
- simple
- calm
- structured
- trustworthy
- fast enough for real life use

The caregiver should feel supported, not overwhelmed.

---

## 2. Primary UX Principles

### 2.1 Calm and low-friction
The product should not feel noisy, crowded, or complicated.

### 2.2 Guided, not open-ended
The system should lead caregivers through structured inputs rather than forcing them to invent everything from scratch.

### 2.3 Review before use
The caregiver should always have a chance to review and edit the story before showing it to the child.

### 2.4 Fast path first
A caregiver should be able to generate a useful story quickly, then refine if needed.

### 2.5 Personalization without burden
The product should make personalization easy without requiring a huge intake process.

---

## 3. Primary Caregiver Journeys

### Journey A — First-time caregiver
1. lands on the app
2. learns what the tool does
3. creates a basic child profile
4. enters a story request
5. gets a generated story
6. reviews/edits it
7. saves or uses it

### Journey B — Returning caregiver
1. opens the app
2. selects an existing child profile
3. chooses a saved scenario or new topic
4. generates a story quickly
5. reviews and uses it

### Journey C — Therapist/teacher workflow
1. selects or creates a profile template
2. chooses a target skill/situation
3. generates a structured story
4. edits wording for session/classroom use
5. saves as a reusable template

---

## 4. MVP Screen Flow

Recommended MVP screens:

1. Home / landing
2. Child profiles
3. New story request
4. Story generation / loading state
5. Story review and edit
6. Save / export
7. Story library

---

## 5. Screen-by-Screen UX

## 5.1 Home / Landing

### Purpose
Help the caregiver understand the product and get started quickly.

### Main actions
- create first child profile
- choose existing child profile
- start a new story
- open saved stories

### UI guidance
Keep this page minimal.

Suggested content:
- one-line explanation of the product
- short reassurance that caregiver review comes first
- big obvious buttons

Suggested primary CTA:
- **Create a Story**

Suggested secondary CTA:
- **Add Child Profile**

---

## 5.2 Child Profiles Screen

### Purpose
Let the caregiver create and manage profiles without feeling like they are filling out a medical form.

### Key actions
- create profile
- edit profile
- archive profile
- choose profile for story generation

### UX approach
Split profile creation into:
- **basic profile** first
- **optional advanced details** second

### Basic profile fields
- character/display name
- age range
- favorite interests
- reading/communication level

### Advanced profile fields
- sensory preferences
- calming strategies
- common challenges
- story tone preferences
- content to avoid

### Important UX note
Do not force advanced fields before the caregiver can generate a story.

---

## 5.3 New Story Request Screen

### Purpose
Collect just enough structured input to generate a useful story.

### Required fields
- selected child profile
- topic/situation
- target skill/goal
- story length

### Optional fields
- setting
- emotional tone
- things to avoid
- use a favorite interest

### UX layout recommendation
The screen should feel like a short guided form, not a long survey.

Suggested sections:
1. **Who is this for?**
2. **What is the situation?**
3. **What should the story help with?**
4. **How should it feel?**

### Helpful shortcuts
Include preset buttons like:
- doctor visit
- waiting turn
- trying something new
- bedtime transition
- asking for help
- loud environment

These lower the effort for caregivers.

---

## 5.4 Story Generation Screen

### Purpose
Show that the system is working without making the wait feel uncertain.

### UX behavior
- simple progress/loading state
- calm reassuring text
- no flashy animation

Possible loading text:
- “Building a calm story...”
- “Keeping the story clear and supportive...”

If generation fails:
- explain simply
- offer retry
- preserve entered form data

---

## 5.5 Story Review and Edit Screen

### Purpose
This is the most important screen in the MVP.
The caregiver must be able to understand the output immediately.

### Main layout
Separate the screen into clear blocks:

1. **Story title**
2. **Child-facing story**
3. **Choices / branches**
4. **Caregiver note**
5. **Review flags**
6. **Actions**

### Main actions
- regenerate whole story
- simplify story
- shorten story
- edit manually
- remove or edit a branch
- save story
- export/copy story

### UX requirements
- child-facing text must be visually separated from caregiver notes
- choices must be explicit and visible
- review flags must be easy to notice
- editing must feel safe and reversible

### Key trust element
Always make it obvious that:
- this is a draft for caregiver review
- the caregiver is expected to approve before use

---

## 5.6 Save / Export Flow

### Purpose
Let the caregiver keep useful stories and reuse them later.

### Save options
- save as story
- save as reusable template
- duplicate and edit later

### Export options for MVP
- copy plain text
- printable story view

Later additions can include PDF/audio/visual story cards.

---

## 5.7 Story Library Screen

### Purpose
Make reuse easy.

### Main functions
- list saved stories
- filter by child
- filter by topic
- reopen/edit a story
- duplicate story
- archive/delete story

### Useful metadata to display
- title
- child profile name
- topic
- date created
- last edited

This should feel like a calm, practical working library.

---

## 6. Caregiver Experience Details

## 6.1 Fast path UX
A caregiver in a hurry should be able to do:
1. choose child profile
2. choose topic preset
3. choose target skill
4. click generate

This should take under a few minutes.

## 6.2 Deep path UX
A caregiver who wants more control should be able to:
- tune tone
- add things to avoid
- add sensory context
- refine branch options

The product should support both without making the simple path worse.

---

## 7. Tone and Language in the UI

The product UI itself should follow the same spirit as the stories:
- calm
- direct
- supportive
- non-judgmental

Avoid:
- hype language
- overly clever copy
- emotionally loud UI phrasing
- guilt-based wording

Prefer:
- “Review before using with your child.”
- “You can simplify or edit anything.”
- “This story is designed to be calm and predictable.”

---

## 8. Error Handling UX

### Errors should be calm and actionable
If something fails:
- explain in plain language
- keep user data intact
- show one next step

Examples:
- “We couldn’t generate the story right now. Please try again.”
- “Your story request is still here.”

### Validation should be light
Do not overwhelm caregivers with strict or noisy validation.
Only block when needed.

---

## 9. Accessibility and Usability Notes

The caregiver UI should aim for:
- high readability
- clear button labels
- strong visual hierarchy
- minimal clutter
- mobile-friendly layout
- easy copy/export behavior

Because many caregivers may use the tool quickly during stressful moments, speed and clarity matter more than decorative complexity.

---

## 10. MVP UX Success Criteria

The caregiver UX is working if:
- a first-time user can create a story without explanation
- a returning user can generate a story in a few minutes
- the review/edit screen feels trustworthy
- saved stories are easy to find and reuse
- the product feels supportive rather than cognitively heavy

---

## 11. Recommended MVP Wireframe Order

### Home
- Create Story
- Add Child Profile
- Open Saved Stories

### Child Profile
- basic fields first
- advanced details collapsed

### Story Request
- topic
- target skill
- length
- options

### Review/Edit
- story
- choices
- caregiver note
- flags
- actions

### Library
- saved stories
- filter
- duplicate/edit

---

## 12. Recommendation

The MVP should optimize for one core feeling:

**“I can make a safe, helpful story for this child quickly, and I trust what I’m looking at.”**

If the UX delivers that feeling, the product has a strong foundation.
