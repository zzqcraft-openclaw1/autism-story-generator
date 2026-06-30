import { z } from 'zod';
import {
  isoDateTimeStringSchema,
  nonEmptyTrimmedStringSchema,
  stringListSchema,
} from './common';

export const childProfileSchema = z.object({
  schema_version: z.literal('1.0'),
  profile_id: nonEmptyTrimmedStringSchema,
  created_at: isoDateTimeStringSchema,
  updated_at: isoDateTimeStringSchema,
  status: z.enum(['active', 'archived']),
  identity: z.object({
    display_name: nonEmptyTrimmedStringSchema,
    character_name: nonEmptyTrimmedStringSchema,
    age_range: nonEmptyTrimmedStringSchema,
    pronouns: stringListSchema,
    setting_context: stringListSchema,
  }),
  communication: z.object({
    reading_level: z.enum(['pre_reader', 'early_reader', 'independent_reader']),
    communication_style: z.enum(['simple_direct', 'visual_support_friendly', 'step_by_step']),
    sentence_complexity: z.enum(['low', 'medium']),
    prefers_repetition: z.boolean(),
    benefits_from_emotion_labels: z.boolean(),
    notes: stringListSchema,
  }),
  interests: z.object({
    favorite_topics: stringListSchema,
    favorite_characters: stringListSchema,
    preferred_themes: stringListSchema,
    avoid_themes: stringListSchema,
  }),
  sensory: z.object({
    sensitive_to: stringListSchema,
    prefers: stringListSchema,
    avoid_in_story: stringListSchema,
    notes: stringListSchema,
  }),
  regulation: z.object({
    helpful_strategies: stringListSchema,
    trusted_supports: stringListSchema,
    common_challenges: stringListSchema,
    successful_scripts: stringListSchema,
    notes: stringListSchema,
  }),
  support_context: z.object({
    primary_operator: nonEmptyTrimmedStringSchema,
    other_support_roles: stringListSchema,
    typical_use_cases: stringListSchema,
  }),
  story_preferences: z.object({
    default_story_length: z.enum(['short', 'medium']),
    preferred_tone: z.enum(['calm_supportive', 'gentle_encouraging']),
    branching_level: z.enum(['none', 'light']),
    prefers_happy_endings: z.boolean(),
    prefers_predictable_structure: z.boolean(),
    allow_gentle_problem_solving: z.boolean(),
  }),
  safety_notes: z.object({
    requires_adult_review: z.boolean(),
    avoid_content: stringListSchema,
    review_triggers: stringListSchema,
    notes: stringListSchema,
  }),
  metadata: z.object({
    created_by_role: nonEmptyTrimmedStringSchema,
    last_updated_by_role: nonEmptyTrimmedStringSchema,
    tags: stringListSchema,
    profile_completeness: z.enum(['basic', 'extended']),
  }),
});

export type ChildProfile = z.infer<typeof childProfileSchema>;
