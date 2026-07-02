import { z } from 'zod';
import { stringListSchema } from './common.ts';

export const storyLengthSchema = z.enum(['short', 'medium']);
export const storyToneSchema = z.enum(['calm_supportive', 'gentle_encouraging']);

const requestTopicSchema = z
  .string()
  .trim()
  .min(1, 'Topic is required.')
  .max(120, 'Topic must stay under 120 characters.');

const requestTargetSkillSchema = z
  .string()
  .trim()
  .min(1, 'Target skill is required.')
  .max(120, 'Target skill must stay under 120 characters.');

const optionalSettingSchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
  },
  z.union([
    z.null(),
    z
      .string()
      .trim()
      .min(1, 'Setting cannot be blank when provided.')
      .max(120, 'Setting must stay under 120 characters.'),
  ]),
);

const avoidListSchema = stringListSchema
  .max(6, 'Keep the avoid list to 6 items or fewer.')
  .refine((items) => new Set(items.map((item) => item.toLowerCase())).size === items.length, {
    message: 'Avoid list should not repeat the same item.',
  });

export const storyRequestSchema = z.object({
  topic: requestTopicSchema,
  target_skill: requestTargetSkillSchema,
  story_length: storyLengthSchema,
  setting: optionalSettingSchema,
  desired_tone: storyToneSchema.nullable(),
  avoid: avoidListSchema,
});

export type StoryRequest = z.infer<typeof storyRequestSchema>;
