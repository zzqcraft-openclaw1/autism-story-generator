import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ChildProfileService } from '../src/child-profiles';
import { JsonFileStore } from '../src/db/store';
import { validChildProfileFixture, validStoryRequestFixture } from '../src/fixtures';
import { StoryGenerationService } from '../src/story-generator';
import { validateStoryOutput } from '../src/validation';

async function makeServices() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'asg-story-'));
  const store = new JsonFileStore(path.join(tempDir, 'store.json'));
  return {
    profiles: new ChildProfileService(store),
    stories: new StoryGenerationService(store),
  };
}

describe('Phase 3-4 request flow and generation', () => {
  it('generates a schema-valid story for a saved child profile', async () => {
    const { profiles, stories } = await makeServices();
    const profile = await profiles.create({
      ...validChildProfileFixture,
      profile_id: undefined,
      created_at: undefined,
      updated_at: undefined,
    });

    const result = await stories.submit({
      profile_id: profile.profile_id,
      request: validStoryRequestFixture,
    });

    expect(result.requestRecord.profile_id).toBe(profile.profile_id);
    expect(result.story.story_request.topic).toBe(validStoryRequestFixture.topic);
    expect(result.story.profile_summary.character_name).toBe(profile.identity.character_name);
    expect(result.story.metadata.branch_count).toBe(result.story.story.choices.length);

    const validation = validateStoryOutput(result.story);
    expect(validation.success).toBe(true);
  });
});
