import type { ChildProfile } from '../schemas/index.ts';

export const validChildProfileFixture: ChildProfile = {
  schema_version: '1.0',
  profile_id: 'child_001',
  created_at: '2026-06-30T03:50:00Z',
  updated_at: '2026-06-30T03:50:00Z',
  status: 'active',
  identity: {
    display_name: 'Milo',
    character_name: 'Milo',
    age_range: '6-8',
    pronouns: ['he', 'him'],
    setting_context: ['home', 'school'],
  },
  communication: {
    reading_level: 'early_reader',
    communication_style: 'simple_direct',
    sentence_complexity: 'low',
    prefers_repetition: true,
    benefits_from_emotion_labels: true,
    notes: ['short sentences help', 'avoid figurative language'],
  },
  interests: {
    favorite_topics: ['trains', 'dogs', 'space'],
    favorite_characters: ['friendly dog'],
    preferred_themes: ['helping', 'routine'],
    avoid_themes: ['chaos'],
  },
  sensory: {
    sensitive_to: ['loud_noises'],
    prefers: ['quiet_spaces', 'predictable_routines'],
    avoid_in_story: ['sudden_loud_events'],
    notes: ['new places can feel overwhelming'],
  },
  regulation: {
    helpful_strategies: ['deep_breathing', 'quiet_break', 'ask_for_help'],
    trusted_supports: ['parent', 'teacher'],
    common_challenges: ['transitions', 'new_places'],
    successful_scripts: ['I need a break', 'Can you help me?'],
    notes: ['does better with warning before transitions'],
  },
  support_context: {
    primary_operator: 'parent',
    other_support_roles: ['teacher'],
    typical_use_cases: ['bedtime', 'school_transition'],
  },
  story_preferences: {
    default_story_length: 'short',
    preferred_tone: 'calm_supportive',
    branching_level: 'light',
    prefers_happy_endings: true,
    prefers_predictable_structure: true,
    allow_gentle_problem_solving: true,
  },
  safety_notes: {
    requires_adult_review: true,
    avoid_content: ['yelling', 'shaming_language'],
    review_triggers: ['doctor_visit'],
    notes: ['review any new story before reading together'],
  },
  metadata: {
    created_by_role: 'parent',
    last_updated_by_role: 'parent',
    tags: ['home', 'social_story'],
    profile_completeness: 'basic',
  },
};

export const invalidChildProfileFixture: unknown = {
  ...validChildProfileFixture,
  identity: {
    ...validChildProfileFixture.identity,
    character_name: '   ',
  },
  communication: {
    ...validChildProfileFixture.communication,
    reading_level: 'advanced_reader',
  },
};
