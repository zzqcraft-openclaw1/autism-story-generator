# Story Output JSON Schema

## 1. Purpose

This schema defines the structured output format for generated stories in the Autism Story Generator project.

The goals of the schema are:
- keep story output predictable
- support safe rendering in the UI
- separate child-facing content from caregiver-facing notes
- make branching explicit and easy to validate
- support future storage, editing, export, and evaluation

This is a **product schema**, not a low-level provider API schema.

---

## 2. Design Principles

The schema should:
- be readable by humans and machines
- make story structure explicit
- avoid hidden meaning inside giant blobs of text
- support validation before showing the story to a child
- allow future additions without breaking the core shape

The schema should not:
- depend on a specific LLM provider format
- assume a chat transcript structure
- assume unlimited branching complexity

---

## 3. Top-Level Object

```json
{
  "schema_version": "1.0",
  "story_id": "story_123",
  "created_at": "2026-06-30T03:45:00Z",
  "language": "en",
  "title": "Getting Ready for the Dentist",
  "profile_summary": { ... },
  "story_request": { ... },
  "story": { ... },
  "caregiver_note": { ... },
  "review_flags": [ ... ],
  "metadata": { ... }
}
```

---

## 4. Top-Level Fields

### `schema_version`
**Type:** string  
Schema version for compatibility.

Example:
```json
"1.0"
```

### `story_id`
**Type:** string  
Unique identifier for the generated story.

### `created_at`
**Type:** string (ISO timestamp)  
When the story was generated.

### `language`
**Type:** string  
Language code for the story output.

### `title`
**Type:** string  
Short human-readable title.

### `profile_summary`
**Type:** object  
A safe summary of the child profile fields actually used in generation.

### `story_request`
**Type:** object  
The request context used to generate the story.

### `story`
**Type:** object  
The child-facing story content and branching.

### `caregiver_note`
**Type:** object  
Adult-facing note and usage guidance.

### `review_flags`
**Type:** array of strings  
Flags for adult review before use.

### `metadata`
**Type:** object  
Generation and safety metadata.

---

## 5. `profile_summary` Object

This should only include fields relevant to the story output, not raw private profile dumps.

```json
"profile_summary": {
  "character_name": "Milo",
  "age_range": "6-8",
  "interests": ["trains", "dogs"],
  "reading_level": "early_reader",
  "communication_style": "simple_direct",
  "sensory_notes": ["sensitive_to_loud_noises"],
  "calming_preferences": ["deep_breaths", "quiet_break"]
}
```

### Suggested fields
- `character_name`: string
- `age_range`: string
- `interests`: string[]
- `reading_level`: string
- `communication_style`: string
- `sensory_notes`: string[]
- `calming_preferences`: string[]

---

## 6. `story_request` Object

This captures what the adult asked for.

```json
"story_request": {
  "topic": "going to the dentist",
  "target_skill": "preparing for a new experience",
  "story_length": "short",
  "setting": "dentist office",
  "desired_tone": "calm_supportive",
  "avoid": ["scary details", "surprising loud events"]
}
```

### Suggested fields
- `topic`: string
- `target_skill`: string
- `story_length`: string
- `setting`: string | null
- `desired_tone`: string | null
- `avoid`: string[]

---

## 7. `story` Object

This contains the actual child-facing story.

```json
"story": {
  "summary": "Milo is getting ready to visit the dentist and learns safe choices for staying calm.",
  "structure": "guided_branching_v1",
  "tone_tags": ["calm", "supportive", "predictable"],
  "opening": "Today, Milo is going to the dentist.",
  "sections": [ ... ],
  "choices": [ ... ],
  "ending": "Milo feels proud for trying something new."
}
```

### Suggested fields
- `summary`: string
- `structure`: string
- `tone_tags`: string[]
- `opening`: string
- `sections`: Section[]
- `choices`: Choice[]
- `ending`: string

---

## 8. `sections` Array

Each section is a child-facing block of the story.

```json
{
  "id": "section_1",
  "kind": "setup",
  "text": "Milo holds his grown-up's hand and walks into the office.",
  "emotion_labels": ["nervous", "curious"],
  "support_cues": ["It is okay to feel nervous when something is new."]
}
```

### Section fields
- `id`: string
- `kind`: string
  - examples:
    - `setup`
    - `challenge`
    - `support`
    - `choice_intro`
    - `outcome`
    - `closing`
- `text`: string
- `emotion_labels`: string[]
- `support_cues`: string[]

---

## 9. `choices` Array

Choices should be explicit and small in number.

```json
{
  "id": "choice_1",
  "label": "Take a deep breath",
  "prompt": "Milo can take a slow deep breath before sitting down.",
  "outcome_text": "Milo's body feels a little calmer.",
  "skill_tags": ["self_regulation"],
  "tone_tags": ["calm", "reassuring"]
}
```

### Choice fields
- `id`: string
- `label`: string
- `prompt`: string
- `outcome_text`: string
- `skill_tags`: string[]
- `tone_tags`: string[]

### Constraint
MVP should usually produce only **2–3 choices max**.

---

## 10. `caregiver_note` Object

This is adult-facing and should never be mixed into the child-facing body.

```json
"caregiver_note": {
  "intended_lesson": "New experiences can feel scary, and calm coping choices can help.",
  "adult_guidance": "Pause after each section and let the child ask questions.",
  "suggested_follow_up": [
    "Practice deep breathing together.",
    "Talk about what the dentist office may sound like."
  ],
  "review_recommendation": "Review before reading if the child is currently anxious about medical visits."
}
```

### Suggested fields
- `intended_lesson`: string
- `adult_guidance`: string
- `suggested_follow_up`: string[]
- `review_recommendation`: string

---

## 11. `review_flags` Array

Flags should help the adult inspect the story before use.

Example:
```json
"review_flags": [
  "mentions_new_environment",
  "contains_medical_context",
  "adult_review_recommended"
]
```

These are not errors by default. They are structured review hints.

---

## 12. `metadata` Object

```json
"metadata": {
  "generator_version": "mvp-v1",
  "prompt_template": "guided_social_story_v1",
  "branch_count": 2,
  "safety_mode": "calm_autism_support",
  "requires_adult_review": true
}
```

### Suggested fields
- `generator_version`: string
- `prompt_template`: string
- `branch_count`: number
- `safety_mode`: string
- `requires_adult_review`: boolean

---

## 13. Full Example

```json
{
  "schema_version": "1.0",
  "story_id": "story_001",
  "created_at": "2026-06-30T03:45:00Z",
  "language": "en",
  "title": "Milo Goes to the Dentist",
  "profile_summary": {
    "character_name": "Milo",
    "age_range": "6-8",
    "interests": ["trains", "dogs"],
    "reading_level": "early_reader",
    "communication_style": "simple_direct",
    "sensory_notes": ["sensitive_to_loud_noises"],
    "calming_preferences": ["deep_breaths", "quiet_break"]
  },
  "story_request": {
    "topic": "going to the dentist",
    "target_skill": "preparing for a new experience",
    "story_length": "short",
    "setting": "dentist office",
    "desired_tone": "calm_supportive",
    "avoid": ["scary details"]
  },
  "story": {
    "summary": "Milo gets ready for the dentist and practices calm choices.",
    "structure": "guided_branching_v1",
    "tone_tags": ["calm", "supportive", "predictable"],
    "opening": "Today, Milo is going to the dentist.",
    "sections": [
      {
        "id": "section_1",
        "kind": "setup",
        "text": "Milo walks into the dentist office with a grown-up.",
        "emotion_labels": ["nervous"],
        "support_cues": ["It is okay to feel nervous when something is new."]
      },
      {
        "id": "section_2",
        "kind": "support",
        "text": "Milo remembers that he can make calm choices.",
        "emotion_labels": ["hopeful"],
        "support_cues": ["Milo can ask for help or take a slow breath."]
      }
    ],
    "choices": [
      {
        "id": "choice_1",
        "label": "Take a deep breath",
        "prompt": "Milo takes a slow deep breath.",
        "outcome_text": "Milo feels a little calmer.",
        "skill_tags": ["self_regulation"],
        "tone_tags": ["calm", "reassuring"]
      },
      {
        "id": "choice_2",
        "label": "Ask a question",
        "prompt": "Milo asks what will happen next.",
        "outcome_text": "Knowing what comes next helps Milo feel safer.",
        "skill_tags": ["self_advocacy"],
        "tone_tags": ["supportive", "clear"]
      }
    ],
    "ending": "Milo feels proud for trying something new."
  },
  "caregiver_note": {
    "intended_lesson": "New experiences can feel scary, and calm choices can help.",
    "adult_guidance": "Pause after each section and keep your tone steady.",
    "suggested_follow_up": [
      "Practice deep breaths together.",
      "Talk about what Milo might hear in the office."
    ],
    "review_recommendation": "Review before use if the child is already worried about medical visits."
  },
  "review_flags": [
    "contains_medical_context",
    "adult_review_recommended"
  ],
  "metadata": {
    "generator_version": "mvp-v1",
    "prompt_template": "guided_social_story_v1",
    "branch_count": 2,
    "safety_mode": "calm_autism_support",
    "requires_adult_review": true
  }
}
```

---

## 14. Validation Rules for MVP

Minimum validation rules:
- `title` must be non-empty
- `story.sections` must contain at least 1 section
- `story.choices` must contain 0 to 3 choices
- every choice must have `label`, `prompt`, and `outcome_text`
- `caregiver_note` must exist
- `metadata.requires_adult_review` must be present

---

## 15. Future Extensions

Possible later additions:
- visual cue cards
- narration blocks
- multilingual rendering fields
- per-section image prompts
- alternate story branches with branch ids and transitions
- classroom mode metadata
- therapist annotation fields

---

## 16. Recommendation

Use this schema as the **contract between generation, validation, storage, and UI rendering**.

That keeps the project controlled and makes it easier to improve the generation system later without rewriting the product structure.
