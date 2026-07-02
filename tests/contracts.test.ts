import { describe, expect, it } from 'vitest';
import {
  invalidChildProfileFixture,
  invalidStoryOutputFixture,
  invalidStoryRequestFixture,
  validChildProfileFixture,
  validStoryOutputFixture,
  validStoryRequestFixture,
} from '../src/fixtures';
import {
  childProfileSchema,
  storyOutputSchema,
  storyRequestSchema,
} from '../src/schemas';
import {
  validateChildProfile,
  validateStoryOutput,
  validateStoryRequest,
} from '../src/validation';

describe('Phase 1 contracts', () => {
  it('accepts the valid child profile fixture', () => {
    const result = childProfileSchema.safeParse(validChildProfileFixture);
    expect(result.success).toBe(true);
  });

  it('rejects the invalid child profile fixture', () => {
    const result = validateChildProfile(invalidChildProfileFixture);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join(' | ')).toContain('identity.character_name');
      expect(result.errors.join(' | ')).toContain('communication.reading_level');
    }
  });

  it('accepts the valid story request fixture', () => {
    const result = storyRequestSchema.safeParse(validStoryRequestFixture);
    expect(result.success).toBe(true);
  });

  it('rejects the invalid story request fixture', () => {
    const result = validateStoryRequest(invalidStoryRequestFixture);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.join(' | ')).toContain('topic');
      expect(result.errors.join(' | ')).toContain('story_length');
    }
  });

  it('normalizes optional setting and rejects duplicate avoid items', () => {
    const result = storyRequestSchema.safeParse({
      ...validStoryRequestFixture,
      setting: '   ',
      avoid: ['scary details', 'Scary Details'],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message).join(' | ')).toContain(
        'Avoid list should not repeat the same item.',
      );
    }

    const normalized = storyRequestSchema.parse({
      ...validStoryRequestFixture,
      setting: '   ',
      avoid: ['scary details'],
    });
    expect(normalized.setting).toBeNull();
  });

  it('accepts the valid story output fixture', () => {
    const result = storyOutputSchema.safeParse(validStoryOutputFixture);
    expect(result.success).toBe(true);
  });

  it('rejects the invalid story output fixture', () => {
    const result = validateStoryOutput(invalidStoryOutputFixture);
    expect(result.success).toBe(false);
    if (!result.success) {
      const combined = result.errors.join(' | ');
      expect(combined).toContain('title');
      expect(combined).toContain('metadata.branch_count');
    }
  });
});
