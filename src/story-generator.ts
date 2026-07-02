import { z } from 'zod';
import { JsonFileStore, type StoredStoryRequest } from './db/store.ts';
import type { ChildProfile, StoryOutput, StoryRequest } from './schemas/index.ts';
import { storyOutputSchema, storyRequestSchema } from './schemas/index.ts';
import { makeId, nowIsoString } from './server/utils.ts';

export interface GenerateStoryInput {
  profile_id: string;
  request: StoryRequest;
}

export class StoryGenerationService {
  constructor(private readonly store = new JsonFileStore()) {}

  async submit(input: unknown): Promise<{ requestRecord: StoredStoryRequest; story: StoryOutput }> {
    const parsed = storyGenerationRequestSchema.parse(input);
    const data = await this.store.read();
    const profile = data.childProfiles.find((entry) => entry.profile_id === parsed.profile_id);

    if (!profile) {
      throw new Error(`Child profile not found: ${parsed.profile_id}`);
    }

    const requestRecord: StoredStoryRequest = {
      request_id: makeId('request'),
      profile_id: profile.profile_id,
      created_at: nowIsoString(),
      request: parsed.request,
    };

    const story = buildStoryOutput(profile, parsed.request);

    data.storyRequests.push(requestRecord);
    data.generatedStories.push(story);
    await this.store.write(data);

    return { requestRecord, story };
  }
}

export const storyGenerationRequestSchema = z.object({
  profile_id: z.string().trim().min(1),
  request: storyRequestSchema,
});

function buildStoryOutput(profile: ChildProfile, request: StoryRequest): StoryOutput {
  const characterName = profile.identity.character_name;
  const topic = request.topic;
  const targetSkill = request.target_skill;
  const setting = request.setting ?? profile.identity.setting_context[0] ?? 'a familiar place';
  const interest = profile.interests.favorite_topics[0] ?? 'something comforting';
  const calmingStrategy = profile.regulation.helpful_strategies[0] ?? 'take a slow breath';
  const supportRole = profile.regulation.trusted_supports[0] ?? 'grown-up';
  const tone = request.desired_tone ?? profile.story_preferences.preferred_tone;

  const sections = [
    {
      id: 'section_1',
      kind: 'setup' as const,
      text: `${characterName} is getting ready for ${topic} at ${setting}. ${characterName} can think about ${interest} while getting ready.`,
      emotion_labels: ['curious', 'nervous'],
      support_cues: [`It is okay if ${topic} feels new or big.`],
    },
    {
      id: 'section_2',
      kind: 'support' as const,
      text: `${characterName} remembers one calm plan: ${formatPhrase(calmingStrategy)}. ${supportRoleLabel(supportRole)} can help too.`,
      emotion_labels: ['calm', 'supported'],
      support_cues: [`${characterName} does not have to do everything alone.`],
    },
  ];

  const choices = [
    {
      id: 'choice_1',
      label: 'Use the calm plan',
      prompt: `${characterName} tries ${formatPhrase(calmingStrategy)}.`,
      outcome_text: `${characterName} feels more ready for the next small step.`,
      skill_tags: ['self_regulation', slugify(targetSkill)],
      tone_tags: ['calm', 'supportive'],
    },
    {
      id: 'choice_2',
      label: 'Ask for help',
      prompt: `${characterName} asks ${supportRoleLabel(supportRole)} what will happen next.`,
      outcome_text: `Knowing the plan helps ${characterName} feel safer and more prepared.`,
      skill_tags: ['self_advocacy', slugify(targetSkill)],
      tone_tags: ['clear', 'reassuring'],
    },
  ];

  return storyOutputSchema.parse({
    schema_version: '1.0',
    story_id: makeId('story'),
    created_at: nowIsoString(),
    language: 'en',
    title: titleCase(`${characterName} practices ${targetSkill}`),
    profile_summary: {
      character_name: characterName,
      age_range: profile.identity.age_range,
      interests: profile.interests.favorite_topics.slice(0, 3),
      reading_level: profile.communication.reading_level,
      communication_style: profile.communication.communication_style,
      sensory_notes: profile.sensory.sensitive_to.slice(0, 3),
      calming_preferences: profile.regulation.helpful_strategies.slice(0, 3),
    },
    story_request: request,
    story: {
      summary: `${characterName} practices ${targetSkill} during ${topic}.`,
      structure: 'guided_branching_v1_stub',
      tone_tags: tone === 'gentle_encouraging' ? ['gentle', 'encouraging', 'predictable'] : ['calm', 'supportive', 'predictable'],
      opening: `${characterName} is safe, and this story will show one small way to practice ${targetSkill}.`,
      sections,
      choices,
      ending: `${characterName} learns that small calm steps can make ${topic} easier.`,
    },
    caregiver_note: {
      intended_lesson: `${characterName} can practice ${targetSkill} with calm support and clear expectations.`,
      adult_guidance: `Read slowly, pause after each section, and model ${formatPhrase(calmingStrategy)} together if helpful.`,
      suggested_follow_up: [
        `Practice ${formatPhrase(calmingStrategy)} before the real situation.`,
        `Ask ${characterName} which helper feels best during ${topic}.`,
      ],
      review_recommendation: 'Adult review is recommended before use, especially for new or stressful situations.',
    },
    review_flags: ['adult_review_recommended', `topic_${slugify(topic)}`],
    metadata: {
      generator_version: 'phase4-stub-v1',
      prompt_template: 'guided_social_story_template_v1',
      branch_count: choices.length,
      safety_mode: 'calm_autism_support',
      requires_adult_review: true,
    },
  });
}

function formatPhrase(value: string): string {
  return value.replace(/_/g, ' ');
}

function supportRoleLabel(value: string): string {
  const normalized = formatPhrase(value);
  return normalized.startsWith('the ') ? normalized : `the ${normalized}`;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'general_support';
}

function titleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}
