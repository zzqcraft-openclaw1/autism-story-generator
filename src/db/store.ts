import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ChildProfile, StoryOutput, StoryRequest } from '../schemas';

export interface StoredStoryRequest {
  request_id: string;
  profile_id: string;
  created_at: string;
  request: StoryRequest;
}

export interface AppStore {
  childProfiles: ChildProfile[];
  storyRequests: StoredStoryRequest[];
  generatedStories: StoryOutput[];
}

const defaultStore: AppStore = {
  childProfiles: [],
  storyRequests: [],
  generatedStories: [],
};

export class JsonFileStore {
  constructor(private readonly filePath = path.resolve(process.cwd(), 'data', 'app-store.json')) {}

  async read(): Promise<AppStore> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<AppStore>;
      return {
        childProfiles: parsed.childProfiles ?? [],
        storyRequests: parsed.storyRequests ?? [],
        generatedStories: parsed.generatedStories ?? [],
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return structuredClone(defaultStore);
      }
      throw error;
    }
  }

  async write(store: AppStore): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(store, null, 2));
  }
}
