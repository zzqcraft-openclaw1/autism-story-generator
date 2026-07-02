import { z } from 'zod';
import {
  isoDateTimeStringSchema,
  languageCodeSchema,
  nonEmptyTrimmedStringSchema,
  stringListSchema,
} from './common.ts';
import { storyRequestSchema } from './story-request.ts';

const profileSummarySchema = z.object({
  character_name: nonEmptyTrimmedStringSchema,
  age_range: nonEmptyTrimmedStringSchema,
  interests: stringListSchema,
  reading_level: z.enum(['pre_reader', 'early_reader', 'independent_reader']),
  communication_style: z.enum(['simple_direct', 'visual_support_friendly', 'step_by_step']),
  sensory_notes: stringListSchema,
  calming_preferences: stringListSchema,
});

const storySectionSchema = z.object({
  id: nonEmptyTrimmedStringSchema,
  kind: z.enum(['setup', 'challenge', 'support', 'choice_intro', 'outcome', 'closing']),
  text: nonEmptyTrimmedStringSchema,
  emotion_labels: stringListSchema,
  support_cues: stringListSchema,
});

const storyChoiceSchema = z.object({
  id: nonEmptyTrimmedStringSchema,
  label: nonEmptyTrimmedStringSchema,
  prompt: nonEmptyTrimmedStringSchema,
  outcome_text: nonEmptyTrimmedStringSchema,
  skill_tags: stringListSchema,
  tone_tags: stringListSchema,
});

export const storyOutputSchema = z.object({
  schema_version: z.literal('1.0'),
  story_id: nonEmptyTrimmedStringSchema,
  created_at: isoDateTimeStringSchema,
  language: languageCodeSchema,
  title: nonEmptyTrimmedStringSchema,
  profile_summary: profileSummarySchema,
  story_request: storyRequestSchema,
  story: z.object({
    summary: nonEmptyTrimmedStringSchema,
    structure: nonEmptyTrimmedStringSchema,
    tone_tags: stringListSchema,
    opening: nonEmptyTrimmedStringSchema,
    sections: z.array(storySectionSchema).min(1),
    choices: z.array(storyChoiceSchema).max(3),
    ending: nonEmptyTrimmedStringSchema,
  }),
  caregiver_note: z.object({
    intended_lesson: nonEmptyTrimmedStringSchema,
    adult_guidance: nonEmptyTrimmedStringSchema,
    suggested_follow_up: stringListSchema,
    review_recommendation: nonEmptyTrimmedStringSchema,
  }),
  review_flags: stringListSchema,
  metadata: z.object({
    generator_version: nonEmptyTrimmedStringSchema,
    prompt_template: nonEmptyTrimmedStringSchema,
    branch_count: z.number().int().min(0).max(3),
    safety_mode: nonEmptyTrimmedStringSchema,
    requires_adult_review: z.boolean(),
  }),
}).refine((value) => value.story.choices.length === value.metadata.branch_count, {
  message: 'metadata.branch_count must match story.choices length',
  path: ['metadata', 'branch_count'],
});

export type StoryOutput = z.infer<typeof storyOutputSchema>;
