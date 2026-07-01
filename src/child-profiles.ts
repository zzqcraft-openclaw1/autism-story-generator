import { z } from 'zod';
import { JsonFileStore } from './db/store';
import { childProfileSchema, type ChildProfile } from './schemas';
import { makeId, nowIsoString } from './server/utils';

const createChildProfileInputSchema = childProfileSchema.omit({
  profile_id: true,
  created_at: true,
  updated_at: true,
});

const updateChildProfileInputSchema = z.object({
  schema_version: z.literal('1.0').optional(),
  status: z.enum(['active', 'archived']).optional(),
  identity: createChildProfileInputSchema.shape.identity.partial().optional(),
  communication: createChildProfileInputSchema.shape.communication.partial().optional(),
  interests: createChildProfileInputSchema.shape.interests.partial().optional(),
  sensory: createChildProfileInputSchema.shape.sensory.partial().optional(),
  regulation: createChildProfileInputSchema.shape.regulation.partial().optional(),
  support_context: createChildProfileInputSchema.shape.support_context.partial().optional(),
  story_preferences: createChildProfileInputSchema.shape.story_preferences.partial().optional(),
  safety_notes: createChildProfileInputSchema.shape.safety_notes.partial().optional(),
  metadata: createChildProfileInputSchema.shape.metadata.partial().optional(),
});

export type CreateChildProfileInput = z.infer<typeof createChildProfileInputSchema>;
export type UpdateChildProfileInput = z.infer<typeof updateChildProfileInputSchema>;

export class ChildProfileService {
  constructor(private readonly store = new JsonFileStore()) {}

  list = async (): Promise<ChildProfile[]> => {
    const data = await this.store.read();
    return data.childProfiles;
  };

  get = async (profileId: string): Promise<ChildProfile | null> => {
    const data = await this.store.read();
    return data.childProfiles.find((profile) => profile.profile_id === profileId) ?? null;
  };

  create = async (input: unknown): Promise<ChildProfile> => {
    const parsed = createChildProfileInputSchema.parse(input);
    const timestamp = nowIsoString();
    const profile: ChildProfile = childProfileSchema.parse({
      ...parsed,
      profile_id: makeId('child'),
      created_at: timestamp,
      updated_at: timestamp,
    });

    const data = await this.store.read();
    data.childProfiles.push(profile);
    await this.store.write(data);
    return profile;
  };

  update = async (profileId: string, input: unknown): Promise<ChildProfile | null> => {
    const patch = updateChildProfileInputSchema.parse(input);
    const data = await this.store.read();
    const index = data.childProfiles.findIndex((profile) => profile.profile_id === profileId);

    if (index === -1) {
      return null;
    }

    const existing = data.childProfiles[index]!;
    const updated = childProfileSchema.parse({
      ...existing,
      ...patch,
      identity: { ...existing.identity, ...patch.identity },
      communication: { ...existing.communication, ...patch.communication },
      interests: { ...existing.interests, ...patch.interests },
      sensory: { ...existing.sensory, ...patch.sensory },
      regulation: { ...existing.regulation, ...patch.regulation },
      support_context: { ...existing.support_context, ...patch.support_context },
      story_preferences: { ...existing.story_preferences, ...patch.story_preferences },
      safety_notes: { ...existing.safety_notes, ...patch.safety_notes },
      metadata: { ...existing.metadata, ...patch.metadata },
      updated_at: nowIsoString(),
    });

    data.childProfiles[index] = updated;
    await this.store.write(data);
    return updated;
  };

  delete = async (profileId: string): Promise<boolean> => {
    const data = await this.store.read();
    const nextProfiles = data.childProfiles.filter((profile) => profile.profile_id !== profileId);

    if (nextProfiles.length === data.childProfiles.length) {
      return false;
    }

    data.childProfiles = nextProfiles;
    await this.store.write(data);
    return true;
  };
}

export const childProfileServices = {
  createChildProfileInputSchema,
  updateChildProfileInputSchema,
};
