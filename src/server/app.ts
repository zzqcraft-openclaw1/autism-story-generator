import { ChildProfileService } from '../child-profiles';
import { StoryGenerationService } from '../story-generator';
import { htmlResponse, jsonResponse, readJsonBody } from './utils';

const childProfiles = new ChildProfileService();
const storyGenerator = new StoryGenerationService();

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  try {
    if (request.method === 'GET' && url.pathname === '/') {
      return htmlResponse(renderHomePage());
    }

    if (request.method === 'GET' && url.pathname === '/story-request') {
      const profiles = await childProfiles.list();
      return htmlResponse(renderStoryRequestPage(profiles));
    }

    if (request.method === 'GET' && url.pathname === '/api/child-profiles') {
      return jsonResponse({ items: await childProfiles.list() });
    }

    if (request.method === 'POST' && url.pathname === '/api/child-profiles') {
      const body = await readJsonBody(request);
      const created = await childProfiles.create(body);
      return jsonResponse(created, 201);
    }

    if (request.method === 'POST' && url.pathname === '/api/story-requests') {
      const body = await readJsonBody(request);
      const result = await storyGenerator.submit(body);
      return jsonResponse(result, 201);
    }

    const profileMatch = url.pathname.match(/^\/api\/child-profiles\/([^/]+)$/);
    if (profileMatch?.[1]) {
      const profileId = decodeURIComponent(profileMatch[1]);

      if (request.method === 'GET') {
        const profile = await childProfiles.get(profileId);
        return profile ? jsonResponse(profile) : jsonResponse({ error: 'Not found' }, 404);
      }

      if (request.method === 'PUT') {
        const body = await readJsonBody(request);
        const updated = await childProfiles.update(profileId, body);
        return updated ? jsonResponse(updated) : jsonResponse({ error: 'Not found' }, 404);
      }

      if (request.method === 'DELETE') {
        const deleted = await childProfiles.delete(profileId);
        return deleted ? new Response(null, { status: 204 }) : jsonResponse({ error: 'Not found' }, 404);
      }
    }

    return jsonResponse({ error: 'Not found' }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: message }, 400);
  }
}

function renderHomePage(): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Autism Story Generator</title>
    <style>
      body { font-family: sans-serif; margin: 2rem auto; max-width: 860px; padding: 0 1rem; line-height: 1.5; }
      textarea, input, select { width: 100%; padding: 0.6rem; margin-top: 0.3rem; margin-bottom: 1rem; }
      button { padding: 0.7rem 1rem; }
      pre { background: #f4f4f4; padding: 1rem; overflow: auto; }
      .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    </style>
  </head>
  <body>
    <h1>Autism Story Generator</h1>
    <p>Thin MVP workspace for child profiles and story generation.</p>
    <div class="card">
      <h2>Create child profile</h2>
      <form id="profile-form">
        <div class="row">
          <label>Display name<input name="display_name" value="Milo" /></label>
          <label>Character name<input name="character_name" value="Milo" /></label>
        </div>
        <div class="row">
          <label>Age range<input name="age_range" value="6-8" /></label>
          <label>Reading level
            <select name="reading_level">
              <option value="pre_reader">pre_reader</option>
              <option value="early_reader" selected>early_reader</option>
              <option value="independent_reader">independent_reader</option>
            </select>
          </label>
        </div>
        <label>Favorite topics (comma-separated)<input name="favorite_topics" value="trains,dogs,space" /></label>
        <label>Sensory sensitivities (comma-separated)<input name="sensitive_to" value="loud_noises" /></label>
        <label>Helpful strategies (comma-separated)<input name="helpful_strategies" value="deep_breathing,quiet_break,ask_for_help" /></label>
        <button type="submit">Save profile</button>
      </form>
      <pre id="profile-result"></pre>
    </div>
    <div class="card">
      <h2>Next step</h2>
      <p><a href="/story-request">Open the story request flow</a></p>
    </div>
    <script>
      const splitList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
      document.getElementById('profile-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        const body = {
          schema_version: '1.0',
          status: 'active',
          identity: {
            display_name: form.get('display_name'),
            character_name: form.get('character_name'),
            age_range: form.get('age_range'),
            pronouns: ['they', 'them'],
            setting_context: ['home', 'school'],
          },
          communication: {
            reading_level: form.get('reading_level'),
            communication_style: 'simple_direct',
            sentence_complexity: 'low',
            prefers_repetition: true,
            benefits_from_emotion_labels: true,
            notes: ['short sentences help'],
          },
          interests: {
            favorite_topics: splitList(form.get('favorite_topics')),
            favorite_characters: [],
            preferred_themes: ['routine'],
            avoid_themes: ['chaos'],
          },
          sensory: {
            sensitive_to: splitList(form.get('sensitive_to')),
            prefers: ['quiet_spaces'],
            avoid_in_story: ['sudden_loud_events'],
            notes: [],
          },
          regulation: {
            helpful_strategies: splitList(form.get('helpful_strategies')),
            trusted_supports: ['parent', 'teacher'],
            common_challenges: ['transitions'],
            successful_scripts: ['I need a break'],
            notes: [],
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
            avoid_content: ['yelling'],
            review_triggers: [],
            notes: [],
          },
          metadata: {
            created_by_role: 'parent',
            last_updated_by_role: 'parent',
            tags: ['mvp'],
            profile_completeness: 'basic',
          },
        };

        const response = await fetch('/api/child-profiles', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        document.getElementById('profile-result').textContent = JSON.stringify(data, null, 2);
      });
    </script>
  </body>
</html>`;
}

function renderStoryRequestPage(profiles: Awaited<ReturnType<ChildProfileService['list']>>): string {
  const options = profiles
    .map(
      (profile) =>
        `<option value="${profile.profile_id}">${profile.identity.display_name} (${profile.profile_id})</option>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Story request</title>
    <style>
      body { font-family: sans-serif; margin: 2rem auto; max-width: 860px; padding: 0 1rem; line-height: 1.5; }
      textarea, input, select { width: 100%; padding: 0.6rem; margin-top: 0.3rem; margin-bottom: 1rem; }
      button { padding: 0.7rem 1rem; }
      pre { background: #f4f4f4; padding: 1rem; overflow: auto; }
    </style>
  </head>
  <body>
    <h1>Story request</h1>
    <p><a href="/">Back to profiles</a></p>
    <form id="story-form">
      <label>Child profile
        <select name="profile_id" ${profiles.length === 0 ? 'disabled' : ''}>
          ${options || '<option>No profiles yet</option>'}
        </select>
      </label>
      <label>Topic<input name="topic" value="going to the dentist" /></label>
      <label>Target skill<input name="target_skill" value="preparing for a new experience" /></label>
      <label>Length
        <select name="story_length">
          <option value="short">short</option>
          <option value="medium">medium</option>
        </select>
      </label>
      <label>Setting<input name="setting" value="dentist office" /></label>
      <label>Tone
        <select name="desired_tone">
          <option value="calm_supportive">calm_supportive</option>
          <option value="gentle_encouraging">gentle_encouraging</option>
        </select>
      </label>
      <label>Avoid (comma-separated)<input name="avoid" value="scary details,surprising loud events" /></label>
      <button type="submit" ${profiles.length === 0 ? 'disabled' : ''}>Generate story</button>
    </form>
    <pre id="story-result"></pre>
    <script>
      const splitList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
      document.getElementById('story-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        const body = {
          profile_id: form.get('profile_id'),
          request: {
            topic: form.get('topic'),
            target_skill: form.get('target_skill'),
            story_length: form.get('story_length'),
            setting: form.get('setting') || null,
            desired_tone: form.get('desired_tone') || null,
            avoid: splitList(form.get('avoid')),
          },
        };

        const response = await fetch('/api/story-requests', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        document.getElementById('story-result').textContent = JSON.stringify(data, null, 2);
      });
    </script>
  </body>
</html>`;
}
