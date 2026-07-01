import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ChildProfileService } from '../src/child-profiles';
import { JsonFileStore } from '../src/db/store';
import { validChildProfileFixture } from '../src/fixtures';

async function makeService() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'asg-profiles-'));
  const store = new JsonFileStore(path.join(tempDir, 'store.json'));
  return new ChildProfileService(store);
}

describe('Phase 2 child profile management', () => {
  it('creates, lists, updates, and deletes a child profile', async () => {
    const service = await makeService();
    const created = await service.create({
      ...validChildProfileFixture,
      profile_id: undefined,
      created_at: undefined,
      updated_at: undefined,
    });

    expect(created.profile_id).toMatch(/^child_/);

    const listed = await service.list();
    expect(listed).toHaveLength(1);

    const updated = await service.update(created.profile_id, {
      identity: { display_name: 'Milo Updated' },
      metadata: { last_updated_by_role: 'teacher' },
    });

    expect(updated?.identity.display_name).toBe('Milo Updated');
    expect(updated?.metadata.last_updated_by_role).toBe('teacher');

    const deleted = await service.delete(created.profile_id);
    expect(deleted).toBe(true);
    expect(await service.list()).toHaveLength(0);
  });
});
