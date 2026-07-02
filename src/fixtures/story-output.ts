import type { StoryOutput } from '../schemas/index.ts';
import { validStoryRequestFixture } from './story-request.ts';

export const validStoryOutputFixture: StoryOutput = {
  schema_version: '1.0',
  story_id: 'story_001',
  created_at: '2026-06-30T03:45:00Z',
  language: 'en',
  title: 'Milo Goes to the Dentist',
  profile_summary: {
    character_name: 'Milo',
    age_range: '6-8',
    interests: ['trains', 'dogs'],
    reading_level: 'early_reader',
    communication_style: 'simple_direct',
    sensory_notes: ['sensitive_to_loud_noises'],
    calming_preferences: ['deep_breaths', 'quiet_break'],
  },
  story_request: validStoryRequestFixture,
  story: {
    summary: 'Milo gets ready for the dentist and practices calm choices.',
    structure: 'guided_branching_v1',
    tone_tags: ['calm', 'supportive', 'predictable'],
    opening: 'Today, Milo is going to the dentist.',
    sections: [
      {
        id: 'section_1',
        kind: 'setup',
        text: 'Milo walks into the dentist office with a grown-up.',
        emotion_labels: ['nervous'],
        support_cues: ['It is okay to feel nervous when something is new.'],
      },
      {
        id: 'section_2',
        kind: 'support',
        text: 'Milo remembers that he can make calm choices.',
        emotion_labels: ['hopeful'],
        support_cues: ['Milo can ask for help or take a slow breath.'],
      },
    ],
    choices: [
      {
        id: 'choice_1',
        label: 'Take a deep breath',
        prompt: 'Milo takes a slow deep breath.',
        outcome_text: 'Milo feels a little calmer.',
        skill_tags: ['self_regulation'],
        tone_tags: ['calm', 'reassuring'],
      },
      {
        id: 'choice_2',
        label: 'Ask a question',
        prompt: 'Milo asks what will happen next.',
        outcome_text: 'Knowing what comes next helps Milo feel safer.',
        skill_tags: ['self_advocacy'],
        tone_tags: ['supportive', 'clear'],
      },
    ],
    ending: 'Milo feels proud for trying something new.',
  },
  caregiver_note: {
    intended_lesson: 'New experiences can feel scary, and calm choices can help.',
    adult_guidance: 'Pause after each section and keep your tone steady.',
    suggested_follow_up: [
      'Practice deep breaths together.',
      'Talk about what Milo might hear in the office.',
    ],
    review_recommendation:
      'Review before use if the child is already worried about medical visits.',
  },
  review_flags: ['contains_medical_context', 'adult_review_recommended'],
  metadata: {
    generator_version: 'mvp-v1',
    prompt_template: 'guided_social_story_v1',
    branch_count: 2,
    safety_mode: 'calm_autism_support',
    requires_adult_review: true,
  },
};

export const invalidStoryOutputFixture: unknown = {
  ...validStoryOutputFixture,
  title: '',
  story: {
    ...validStoryOutputFixture.story,
    choices: [
      ...validStoryOutputFixture.story.choices,
      {
        id: 'choice_3',
        label: 'Wave hello',
        prompt: 'Milo waves hello to the dentist.',
        outcome_text: 'Milo feels brave.',
        skill_tags: ['social_skills'],
        tone_tags: ['gentle'],
      },
      {
        id: 'choice_4',
        label: 'Hide under the chair',
        prompt: 'Milo hides under the chair.',
        outcome_text: 'The room feels more confusing.',
        skill_tags: ['avoidance'],
        tone_tags: ['tense'],
      },
    ],
  },
  metadata: {
    ...validStoryOutputFixture.metadata,
    branch_count: 1,
  },
};
