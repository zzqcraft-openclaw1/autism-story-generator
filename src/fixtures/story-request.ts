import type { StoryRequest } from '../schemas';

export const validStoryRequestFixture: StoryRequest = {
  topic: 'going to the dentist',
  target_skill: 'preparing for a new experience',
  story_length: 'short',
  setting: 'dentist office',
  desired_tone: 'calm_supportive',
  avoid: ['scary details', 'surprising loud events'],
};

export const invalidStoryRequestFixture: unknown = {
  ...validStoryRequestFixture,
  topic: '',
  story_length: 'long',
};
