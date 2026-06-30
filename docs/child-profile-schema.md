# Child Profile Schema

## 1. Purpose

This schema defines the structured child profile used by the Autism Story Generator.

The profile exists to help the system generate stories that are:
- more personal
- more understandable
- more calming
- better matched to the child’s communication and support needs

The profile should guide story generation without turning into a medical record or an overly invasive dossier.

---

## 2. Design Principles

The child profile should be:
- lightweight enough for caregivers to complete quickly
- specific enough to improve story quality
- editable over time
- privacy-conscious
- structured enough for validation

The profile should **not** try to capture everything about a child.
It only needs the information that makes stories more appropriate and useful.

---

## 3. Top-Level Object

```json
{
  "schema_version": "1.0",
  "profile_id": "child_001",
  "created_at": "2026-06-30T03:50:00Z",
  "updated_at": "2026-06-30T03:50:00Z",
  "status": "active",
  "identity": { ... },
  "communication": { ... },
  "interests": { ... },
  "sensory": { ... },
  "regulation": { ... },
  "support_context": { ... },
  "story_preferences": { ... },
  "safety_notes": { ... },
  "metadata": { ... }
}
```

---

## 4. Top-Level Fields

### `schema_version`
**Type:** string  
Profile schema version.

### `profile_id`
**Type:** string  
Unique profile identifier.

### `created_at`
**Type:** string (ISO timestamp)

### `updated_at`
**Type:** string (ISO timestamp)

### `status`
**Type:** string  
Examples:
- `active`
- `archived`

### `identity`
**Type:** object  
Basic story-facing identity settings.

### `communication`
**Type:** object  
Reading and communication preferences.

### `interests`
**Type:** object  
Topics and themes the child enjoys.

### `sensory`
**Type:** object  
Sensory sensitivities or preferences relevant to stories.

### `regulation`
**Type:** object  
Helpful calming/support strategies.

### `support_context`
**Type:** object  
Who is using the tool and in what context.

### `story_preferences`
**Type:** object  
Preferred story structure and tone.

### `safety_notes`
**Type:** object  
Things to avoid or review carefully.

### `metadata`
**Type:** object  
Administrative fields.

---

## 5. `identity` Object

This should support story personalization while minimizing unnecessary personal data.

```json
"identity": {
  "display_name": "Milo",
  "character_name": "Milo",
  "age_range": "6-8",
  "pronouns": ["he", "him"],
  "setting_context": ["home", "school"]
}
```

### Suggested fields
- `display_name`: string
- `character_name`: string
- `age_range`: string
- `pronouns`: string[]
- `setting_context`: string[]

### Notes
- `display_name` can be caregiver-facing
- `character_name` can be the name used inside stories
- if privacy matters, these can differ

---

## 6. `communication` Object

```json
"communication": {
  "reading_level": "early_reader",
  "communication_style": "simple_direct",
  "sentence_complexity": "low",
  "prefers_repetition": true,
  "benefits_from_emotion_labels": true,
  "notes": ["short sentences help", "avoid figurative language"]
}
```

### Suggested fields
- `reading_level`: enum/string
  - `pre_reader`
  - `early_reader`
  - `independent_reader`
- `communication_style`: enum/string
  - `simple_direct`
  - `visual_support_friendly`
  - `step_by_step`
- `sentence_complexity`: enum/string
  - `low`
  - `medium`
- `prefers_repetition`: boolean
- `benefits_from_emotion_labels`: boolean
- `notes`: string[]

---

## 7. `interests` Object

```json
"interests": {
  "favorite_topics": ["trains", "dogs", "space"],
  "favorite_characters": ["friendly dog", "train conductor"],
  "preferred_themes": ["adventure", "helping", "routine"],
  "avoid_themes": ["conflict", "chaos"]
}
```

### Suggested fields
- `favorite_topics`: string[]
- `favorite_characters`: string[]
- `preferred_themes`: string[]
- `avoid_themes`: string[]

---

## 8. `sensory` Object

```json
"sensory": {
  "sensitive_to": ["loud_noises", "bright_lights"],
  "prefers": ["quiet_spaces", "predictable_routines"],
  "avoid_in_story": ["sudden_loud_events", "crowded_confusing_scenes"],
  "notes": ["new places can feel overwhelming"]
}
```

### Suggested fields
- `sensitive_to`: string[]
- `prefers`: string[]
- `avoid_in_story`: string[]
- `notes`: string[]

This section helps the generator avoid overstimulating content.

---

## 9. `regulation` Object

```json
"regulation": {
  "helpful_strategies": ["deep_breathing", "quiet_break", "ask_for_help"],
  "trusted_supports": ["parent", "teacher", "therapist"],
  "common_challenges": ["transitions", "waiting", "new_places"],
  "successful_scripts": ["I need a break", "Can you help me?"],
  "notes": ["does better with warning before transitions"]
}
```

### Suggested fields
- `helpful_strategies`: string[]
- `trusted_supports`: string[]
- `common_challenges`: string[]
- `successful_scripts`: string[]
- `notes`: string[]

---

## 10. `support_context` Object

```json
"support_context": {
  "primary_operator": "parent",
  "other_support_roles": ["teacher", "therapist"],
  "typical_use_cases": ["bedtime", "school_transition", "social_preparation"]
}
```

### Suggested fields
- `primary_operator`: string
- `other_support_roles`: string[]
- `typical_use_cases`: string[]

This helps tune output for home vs therapy vs classroom contexts.

---

## 11. `story_preferences` Object

```json
"story_preferences": {
  "default_story_length": "short",
  "preferred_tone": "calm_supportive",
  "branching_level": "light",
  "prefers_happy_endings": true,
  "prefers_predictable_structure": true,
  "allow_gentle_problem_solving": true
}
```

### Suggested fields
- `default_story_length`: string
  - `short`
  - `medium`
- `preferred_tone`: string
  - `calm_supportive`
  - `gentle_encouraging`
- `branching_level`: string
  - `none`
  - `light`
- `prefers_happy_endings`: boolean
- `prefers_predictable_structure`: boolean
- `allow_gentle_problem_solving`: boolean

---

## 12. `safety_notes` Object

```json
"safety_notes": {
  "requires_adult_review": true,
  "avoid_content": ["medical_details", "yelling", "shaming_language"],
  "review_triggers": ["doctor_visit", "school_conflict"],
  "notes": ["review any new story before reading together"]
}
```

### Suggested fields
- `requires_adult_review`: boolean
- `avoid_content`: string[]
- `review_triggers`: string[]
- `notes`: string[]

This section is not for diagnosis.
It is for content caution and adult review workflow.

---

## 13. `metadata` Object

```json
"metadata": {
  "created_by_role": "parent",
  "last_updated_by_role": "parent",
  "tags": ["home", "social_story"],
  "profile_completeness": "basic"
}
```

### Suggested fields
- `created_by_role`: string
- `last_updated_by_role`: string
- `tags`: string[]
- `profile_completeness`: string
  - `basic`
  - `extended`

---

## 14. Full Example

```json
{
  "schema_version": "1.0",
  "profile_id": "child_001",
  "created_at": "2026-06-30T03:50:00Z",
  "updated_at": "2026-06-30T03:50:00Z",
  "status": "active",
  "identity": {
    "display_name": "Milo",
    "character_name": "Milo",
    "age_range": "6-8",
    "pronouns": ["he", "him"],
    "setting_context": ["home", "school"]
  },
  "communication": {
    "reading_level": "early_reader",
    "communication_style": "simple_direct",
    "sentence_complexity": "low",
    "prefers_repetition": true,
    "benefits_from_emotion_labels": true,
    "notes": ["short sentences help", "avoid figurative language"]
  },
  "interests": {
    "favorite_topics": ["trains", "dogs", "space"],
    "favorite_characters": ["friendly dog"],
    "preferred_themes": ["helping", "routine"],
    "avoid_themes": ["chaos"]
  },
  "sensory": {
    "sensitive_to": ["loud_noises"],
    "prefers": ["quiet_spaces", "predictable_routines"],
    "avoid_in_story": ["sudden_loud_events"],
    "notes": ["new places can feel overwhelming"]
  },
  "regulation": {
    "helpful_strategies": ["deep_breathing", "quiet_break", "ask_for_help"],
    "trusted_supports": ["parent", "teacher"],
    "common_challenges": ["transitions", "new_places"],
    "successful_scripts": ["I need a break", "Can you help me?"],
    "notes": ["does better with warning before transitions"]
  },
  "support_context": {
    "primary_operator": "parent",
    "other_support_roles": ["teacher"],
    "typical_use_cases": ["bedtime", "school_transition"]
  },
  "story_preferences": {
    "default_story_length": "short",
    "preferred_tone": "calm_supportive",
    "branching_level": "light",
    "prefers_happy_endings": true,
    "prefers_predictable_structure": true,
    "allow_gentle_problem_solving": true
  },
  "safety_notes": {
    "requires_adult_review": true,
    "avoid_content": ["yelling", "shaming_language"],
    "review_triggers": ["doctor_visit"],
    "notes": ["review any new story before reading together"]
  },
  "metadata": {
    "created_by_role": "parent",
    "last_updated_by_role": "parent",
    "tags": ["home", "social_story"],
    "profile_completeness": "basic"
  }
}
```

---

## 15. Validation Rules for MVP

Minimum validation rules:
- `identity.character_name` must exist
- `identity.age_range` must exist
- `communication.reading_level` must exist
- `interests.favorite_topics` may be empty but should exist
- `story_preferences.default_story_length` must exist
- `safety_notes.requires_adult_review` must exist

---

## 16. Privacy Guidance

The profile should avoid unnecessary sensitive data.

Avoid storing:
- diagnosis history details
- legal names unless needed
- unrelated medical history
- school/legal identifiers
- excessive family/private notes

Store only what improves story quality and safety.

---

## 17. Basic vs Extended Profile

### Basic profile
Enough to generate decent stories quickly:
- character name
- age range
- interests
- reading level
- preferred tone

### Extended profile
Useful for more tailored outputs:
- sensory notes
- regulation strategies
- challenge situations
- support roles
- review triggers

This lets the product support both quick setup and richer personalization.

---

## 18. Recommendation

Use this child profile schema as the personalization contract for:
- story generation
- story validation
- saved preferences
- caregiver workflow

Keep the first UI focused on the **basic profile**, and reveal extended fields only when useful.
