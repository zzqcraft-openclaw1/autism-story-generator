import { z } from 'zod';
import { nonEmptyTrimmedStringSchema, stringListSchema } from './common';

export const storyLengthSchema = z.enum(['short', 'medium']);
export const storyToneSchema = z.enum(['calm_supportive', 'gentle_encouraging']);

export const storyRequestSchema = z.object({
  topic: nonEmptyTrimmedStringSchema,
  target_skill: nonEmptyTrimmedStringSchema,
  story_length: storyLengthSchema,
  setting: nonEmptyTrimmedStringSchema.nullable(),
  desired_tone: storyToneSchema.nullable(),
  avoid: stringListSchema,
});

export type StoryRequest = z.infer<typeof storyRequestSchema>;
