import { type ZodSchema } from 'zod';
import {
  childProfileSchema,
  storyOutputSchema,
  storyRequestSchema,
  type ChildProfile,
  type StoryOutput,
  type StoryRequest,
} from './schemas/index.ts';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export function validateWithSchema<T>(schema: ZodSchema<T>, input: unknown): ValidationResult<T> {
  const result = schema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${path}: ${issue.message}`;
    }),
  };
}

export const parseChildProfile = (input: unknown): ChildProfile => childProfileSchema.parse(input);
export const parseStoryRequest = (input: unknown): StoryRequest => storyRequestSchema.parse(input);
export const parseStoryOutput = (input: unknown): StoryOutput => storyOutputSchema.parse(input);

export const validateChildProfile = (input: unknown) => validateWithSchema(childProfileSchema, input);
export const validateStoryRequest = (input: unknown) => validateWithSchema(storyRequestSchema, input);
export const validateStoryOutput = (input: unknown) => validateWithSchema(storyOutputSchema, input);
