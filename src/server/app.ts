import { ChildProfileService } from '../child-profiles.ts';
import { StoryGenerationService } from '../story-generator.ts';
import { htmlResponse, jsonResponse, readJsonBody } from './utils.ts';

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
      textarea, input, select { width: 100%; padding: 0.6rem; margin-top: 0.3rem; margin-bottom: 1rem; box-sizing: border-box; }
      button { padding: 0.7rem 1rem; }
      pre { background: #f4f4f4; padding: 1rem; overflow: auto; }
      .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
      .status { min-height: 1.5rem; margin: 0.5rem 0 1rem; font-weight: 600; }
      .status[data-kind="error"] { color: #b42318; }
      .status[data-kind="success"] { color: #067647; }
      .status[data-kind="info"] { color: #175cd3; }
      .muted { color: #555; }
    </style>
  </head>
  <body>
    <h1>Autism Story Generator</h1>
    <p>Thin MVP workspace for child profiles and story generation.</p>
    <div class="card">
      <h2 id="profile-form-title">Create child profile</h2>
      <p class="muted" id="profile-form-hint">Start a new child profile, or load an existing one to edit it without wiping the rest of its saved details.</p>
      <label>Saved profiles
        <select id="profile-picker">
          <option value="">Create a new profile</option>
        </select>
      </label>
      <div class="status" id="profile-status" data-kind="info">Ready for a new profile.</div>
      <form id="profile-form">
        <input type="hidden" name="profile_id" value="" />
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
        <div class="actions">
          <button type="submit" id="save-profile">Save new profile</button>
          <button type="button" id="new-profile">Start new profile</button>
          <button type="button" id="delete-profile" hidden>Delete selected profile</button>
        </div>
      </form>
      <pre id="profile-result"></pre>
    </div>
    <div class="card">
      <h2>Next step</h2>
      <p><a href="/story-request">Open the story request flow</a></p>
    </div>
    <script>
      const splitList = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
      const joinList = (value) => Array.isArray(value) ? value.join(', ') : '';
      const clone = (value) => JSON.parse(JSON.stringify(value));
      const formElement = document.getElementById('profile-form');
      const pickerElement = document.getElementById('profile-picker');
      const resultElement = document.getElementById('profile-result');
      const statusElement = document.getElementById('profile-status');
      const titleElement = document.getElementById('profile-form-title');
      const hintElement = document.getElementById('profile-form-hint');
      const saveButton = document.getElementById('save-profile');
      const deleteButton = document.getElementById('delete-profile');

      const baseProfile = {
        schema_version: '1.0',
        status: 'active',
        identity: {
          display_name: 'Milo',
          character_name: 'Milo',
          age_range: '6-8',
          pronouns: ['they', 'them'],
          setting_context: ['home', 'school'],
        },
        communication: {
          reading_level: 'early_reader',
          communication_style: 'simple_direct',
          sentence_complexity: 'low',
          prefers_repetition: true,
          benefits_from_emotion_labels: true,
          notes: ['short sentences help'],
        },
        interests: {
          favorite_topics: ['trains', 'dogs', 'space'],
          favorite_characters: [],
          preferred_themes: ['routine'],
          avoid_themes: ['chaos'],
        },
        sensory: {
          sensitive_to: ['loud_noises'],
          prefers: ['quiet_spaces'],
          avoid_in_story: ['sudden_loud_events'],
          notes: [],
        },
        regulation: {
          helpful_strategies: ['deep_breathing', 'quiet_break', 'ask_for_help'],
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

      let currentProfile = null;

      const setStatus = (message, kind = 'info') => {
        statusElement.textContent = message;
        statusElement.dataset.kind = kind;
      };

      const setMode = (profile) => {
        const editing = Boolean(profile && profile.profile_id);
        titleElement.textContent = editing ? 'Edit child profile' : 'Create child profile';
        hintElement.textContent = editing
          ? 'You are editing an existing saved profile. Only the fields in this form change; the rest of the saved profile stays intact.'
          : 'Start a new child profile, or load an existing one to edit it without wiping the rest of its saved details.';
        saveButton.textContent = editing ? 'Save profile updates' : 'Save new profile';
        deleteButton.hidden = !editing;
      };

      const resetForm = () => {
        const draft = clone(baseProfile);
        formElement.elements.profile_id.value = '';
        formElement.elements.display_name.value = draft.identity.display_name;
        formElement.elements.character_name.value = draft.identity.character_name;
        formElement.elements.age_range.value = draft.identity.age_range;
        formElement.elements.reading_level.value = draft.communication.reading_level;
        formElement.elements.favorite_topics.value = joinList(draft.interests.favorite_topics);
        formElement.elements.sensitive_to.value = joinList(draft.sensory.sensitive_to);
        formElement.elements.helpful_strategies.value = joinList(draft.regulation.helpful_strategies);
        pickerElement.value = '';
        currentProfile = null;
        setMode(null);
      };

      const fillForm = (profile) => {
        formElement.elements.profile_id.value = profile.profile_id || '';
        formElement.elements.display_name.value = profile.identity.display_name;
        formElement.elements.character_name.value = profile.identity.character_name;
        formElement.elements.age_range.value = profile.identity.age_range;
        formElement.elements.reading_level.value = profile.communication.reading_level;
        formElement.elements.favorite_topics.value = joinList(profile.interests.favorite_topics);
        formElement.elements.sensitive_to.value = joinList(profile.sensory.sensitive_to);
        formElement.elements.helpful_strategies.value = joinList(profile.regulation.helpful_strategies);
        currentProfile = profile;
        setMode(profile);
      };

      const buildPayload = (existingProfile) => {
        const form = new FormData(formElement);
        const draft = clone(existingProfile || baseProfile);
        draft.schema_version = '1.0';
        draft.status = draft.status || 'active';
        draft.identity.display_name = String(form.get('display_name') || '').trim();
        draft.identity.character_name = String(form.get('character_name') || '').trim();
        draft.identity.age_range = String(form.get('age_range') || '').trim();
        draft.communication.reading_level = String(form.get('reading_level') || '').trim();
        draft.interests.favorite_topics = splitList(form.get('favorite_topics'));
        draft.sensory.sensitive_to = splitList(form.get('sensitive_to'));
        draft.regulation.helpful_strategies = splitList(form.get('helpful_strategies'));
        draft.metadata.last_updated_by_role = draft.metadata.last_updated_by_role || 'parent';
        return draft;
      };

      const loadProfiles = async (selectedProfileId = '') => {
        const response = await fetch('/api/child-profiles');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Unable to load profiles');
        }
        const items = data.items || [];
        pickerElement.innerHTML = '<option value="">Create a new profile</option>' + items
          .map((profile) => '<option value="' + profile.profile_id + '">' + profile.identity.display_name + ' (' + profile.profile_id + ')</option>')
          .join('');
        if (selectedProfileId) {
          pickerElement.value = selectedProfileId;
        }
        return items;
      };

      const loadProfile = async (profileId) => {
        const response = await fetch('/api/child-profiles/' + encodeURIComponent(profileId));
        const profile = await response.json();
        if (!response.ok) {
          throw new Error(profile.error || 'Unable to load profile');
        }
        fillForm(profile);
        resultElement.textContent = JSON.stringify(profile, null, 2);
        setStatus('Loaded ' + profile.identity.display_name + ' for editing.', 'info');
      };

      pickerElement.addEventListener('change', async (event) => {
        const profileId = event.target.value;
        if (!profileId) {
          resetForm();
          resultElement.textContent = '';
          setStatus('Ready for a new profile.', 'info');
          return;
        }

        try {
          setStatus('Loading saved profile…', 'info');
          await loadProfile(profileId);
        } catch (error) {
          setStatus(error.message || 'Unable to load saved profile.', 'error');
        }
      });

      document.getElementById('new-profile').addEventListener('click', () => {
        resetForm();
        resultElement.textContent = '';
        setStatus('Switched to new profile mode.', 'info');
      });

      deleteButton.addEventListener('click', async () => {
        const profileId = formElement.elements.profile_id.value;
        if (!profileId) {
          return;
        }

        const confirmed = window.confirm('Delete this saved profile? This cannot be undone from the UI.');
        if (!confirmed) {
          return;
        }

        try {
          setStatus('Deleting profile…', 'info');
          const response = await fetch('/api/child-profiles/' + encodeURIComponent(profileId), { method: 'DELETE' });
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Unable to delete profile');
          }
          await loadProfiles();
          resetForm();
          resultElement.textContent = '';
          setStatus('Profile deleted.', 'success');
        } catch (error) {
          setStatus(error.message || 'Unable to delete profile.', 'error');
        }
      });

      document.getElementById('profile-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const profileId = formElement.elements.profile_id.value;

        try {
          setStatus(profileId ? 'Saving profile updates…' : 'Saving new profile…', 'info');
          const existingProfile = profileId ? (currentProfile || await (await fetch('/api/child-profiles/' + encodeURIComponent(profileId))).json()) : null;
          const body = buildPayload(existingProfile);
          const response = await fetch(profileId ? '/api/child-profiles/' + encodeURIComponent(profileId) : '/api/child-profiles', {
            method: profileId ? 'PUT' : 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Unable to save profile');
          }
          resultElement.textContent = JSON.stringify(data, null, 2);
          await loadProfiles(data.profile_id);
          fillForm(data);
          setStatus(profileId ? 'Profile updates saved.' : 'New profile saved.', 'success');
        } catch (error) {
          setStatus(error.message || 'Unable to save profile.', 'error');
        }
      });

      resetForm();
      loadProfiles().catch((error) => {
        setStatus(error.message || 'Unable to load saved profiles.', 'error');
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

  const scenarioPresets = [
    {
      id: 'dentist',
      label: 'Dentist visit',
      description: 'New experience with a predictable support plan.',
      topic: 'going to the dentist',
      target_skill: 'preparing for a new experience',
      story_length: 'short',
      setting: 'dentist office',
      desired_tone: 'calm_supportive',
      avoid: ['scary details', 'surprising loud events'],
    },
    {
      id: 'haircut',
      label: 'Haircut',
      description: 'Sensory-heavy routine with clear expectations.',
      topic: 'getting a haircut',
      target_skill: 'staying calm during sensory discomfort',
      story_length: 'short',
      setting: 'hair salon',
      desired_tone: 'gentle_encouraging',
      avoid: ['buzzing close to ears', 'sudden rushing'],
    },
    {
      id: 'playground',
      label: 'Taking turns at the playground',
      description: 'Social flexibility with waiting and asking for help.',
      topic: 'waiting for a turn on the swing',
      target_skill: 'flexible waiting and safe asking',
      story_length: 'medium',
      setting: 'playground',
      desired_tone: 'calm_supportive',
      avoid: ['shaming language', 'crowded chaos'],
    },
    {
      id: 'bedtime',
      label: 'Bedtime transition',
      description: 'Routine change with regulation support.',
      topic: 'getting ready for bedtime',
      target_skill: 'moving through a routine step by step',
      story_length: 'short',
      setting: 'home bedroom',
      desired_tone: 'gentle_encouraging',
      avoid: ['threats', 'loud conflict'],
    },
  ];

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Story request</title>
    <style>
      body { font-family: sans-serif; margin: 2rem auto; max-width: 960px; padding: 0 1rem; line-height: 1.5; }
      textarea, input, select { width: 100%; padding: 0.6rem; margin-top: 0.3rem; margin-bottom: 1rem; box-sizing: border-box; }
      button { padding: 0.7rem 1rem; }
      pre { background: #f4f4f4; padding: 1rem; overflow: auto; }
      .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
      .status { min-height: 1.5rem; margin: 0.5rem 0 1rem; font-weight: 600; }
      .status[data-kind="error"] { color: #b42318; }
      .status[data-kind="success"] { color: #067647; }
      .status[data-kind="info"] { color: #175cd3; }
      .muted { color: #555; }
      .preset-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
      .preset-button { text-align: left; border: 1px solid #ccc; border-radius: 8px; background: #fff; }
      .preset-button strong { display: block; margin-bottom: 0.2rem; }
      .section-list { display: grid; gap: 0.75rem; }
      .story-block { background: #f8f9fb; border-radius: 8px; padding: 0.85rem; }
      .pill-list { display: flex; gap: 0.5rem; flex-wrap: wrap; padding: 0; list-style: none; }
      .pill-list li { background: #eef2ff; border-radius: 999px; padding: 0.25rem 0.65rem; }
      details summary { cursor: pointer; font-weight: 600; }
    </style>
  </head>
  <body>
    <h1>Story request</h1>
    <p><a href="/">Back to profiles</a></p>
    <div class="card">
      <h2>Build a story request</h2>
      <p class="muted">Pick a saved child profile, start from a scenario preset if useful, then adjust the request before generating.</p>
      <div class="preset-grid" id="preset-grid"></div>
      <div class="status" id="story-status" data-kind="info">Choose a profile and generate a story.</div>
      <form id="story-form">
        <label>Child profile
          <select name="profile_id" ${profiles.length === 0 ? 'disabled' : ''}>
            ${options || '<option value="">No profiles yet</option>'}
          </select>
        </label>
        <div class="row">
          <label>Topic<input name="topic" value="going to the dentist" maxlength="120" /></label>
          <label>Target skill<input name="target_skill" value="preparing for a new experience" maxlength="120" /></label>
        </div>
        <div class="row">
          <label>Length
            <select name="story_length">
              <option value="short">short</option>
              <option value="medium">medium</option>
            </select>
          </label>
          <label>Setting<input name="setting" value="dentist office" maxlength="120" /></label>
        </div>
        <div class="row">
          <label>Tone
            <select name="desired_tone">
              <option value="calm_supportive">calm_supportive</option>
              <option value="gentle_encouraging">gentle_encouraging</option>
            </select>
          </label>
          <label>Avoid (comma-separated)<input name="avoid" value="scary details, surprising loud events" /></label>
        </div>
        <div class="actions">
          <button type="submit" ${profiles.length === 0 ? 'disabled' : ''}>Generate story</button>
          <button type="button" id="reset-request">Reset to default request</button>
        </div>
      </form>
    </div>
    <div class="card" id="story-output-card" hidden>
      <h2 id="story-title">Generated story</h2>
      <p class="muted" id="story-summary"></p>
      <div class="row">
        <div>
          <h3>Child-facing story</h3>
          <div class="story-block" id="child-story"></div>
        </div>
        <div>
          <h3>Choices</h3>
          <div class="section-list" id="story-choices"></div>
        </div>
      </div>
      <div class="row">
        <div>
          <h3>Caregiver note</h3>
          <div class="story-block" id="caregiver-note"></div>
        </div>
        <div>
          <h3>Review flags</h3>
          <div class="story-block" id="review-flags"></div>
        </div>
      </div>
      <details>
        <summary>Raw API response</summary>
        <pre id="story-result"></pre>
      </details>
    </div>
    <script>
      const presets = ${JSON.stringify(scenarioPresets)};
      const defaultRequest = presets[0];
      const formElement = document.getElementById('story-form');
      const statusElement = document.getElementById('story-status');
      const outputCard = document.getElementById('story-output-card');
      const resultElement = document.getElementById('story-result');
      const splitList = (value) => String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
      const uniqueList = (items) => items.filter((item, index) => items.findIndex((other) => other.toLowerCase() === item.toLowerCase()) === index);
      const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      const setStatus = (message, kind = 'info') => {
        statusElement.textContent = message;
        statusElement.dataset.kind = kind;
      };

      const applyPreset = (preset) => {
        formElement.elements.topic.value = preset.topic;
        formElement.elements.target_skill.value = preset.target_skill;
        formElement.elements.story_length.value = preset.story_length;
        formElement.elements.setting.value = preset.setting;
        formElement.elements.desired_tone.value = preset.desired_tone;
        formElement.elements.avoid.value = preset.avoid.join(', ');
        setStatus('Applied preset: ' + preset.label + '.', 'info');
      };

      const renderPresets = () => {
        document.getElementById('preset-grid').innerHTML = presets.map((preset) =>
          '<button type="button" class="preset-button" data-preset="' + preset.id + '"><strong>' + escapeHtml(preset.label) + '</strong><span>' + escapeHtml(preset.description) + '</span></button>'
        ).join('');

        document.querySelectorAll('[data-preset]').forEach((button) => {
          button.addEventListener('click', () => {
            const preset = presets.find((entry) => entry.id === button.dataset.preset);
            if (preset) {
              applyPreset(preset);
            }
          });
        });
      };

      const validateRequest = (body) => {
        const errors = [];
        if (!body.profile_id) {
          errors.push('Choose a saved child profile.');
        }
        if (!body.request.topic || body.request.topic.length > 120) {
          errors.push(body.request.topic ? 'Topic must stay under 120 characters.' : 'Topic is required.');
        }
        if (!body.request.target_skill || body.request.target_skill.length > 120) {
          errors.push(body.request.target_skill ? 'Target skill must stay under 120 characters.' : 'Target skill is required.');
        }
        if (body.request.setting && body.request.setting.length > 120) {
          errors.push('Setting must stay under 120 characters.');
        }
        if (body.request.avoid.length > 6) {
          errors.push('Keep the avoid list to 6 items or fewer.');
        }
        if (new Set(body.request.avoid.map((item) => item.toLowerCase())).size !== body.request.avoid.length) {
          errors.push('Avoid list should not repeat the same item.');
        }
        return errors;
      };

      const renderStory = (payload) => {
        const story = payload.story;
        outputCard.hidden = false;
        document.getElementById('story-title').textContent = story.title;
        document.getElementById('story-summary').textContent = story.story.summary;
        document.getElementById('child-story').innerHTML = [
          '<p><strong>Opening:</strong> ' + escapeHtml(story.story.opening) + '</p>',
          ...story.story.sections.map((section, index) =>
            '<p><strong>Step ' + (index + 1) + ':</strong> ' + escapeHtml(section.text) + '</p>' +
            '<p class="muted">Emotions: ' + escapeHtml(section.emotion_labels.join(', ') || 'none') + '<br />Support cues: ' + escapeHtml(section.support_cues.join(', ') || 'none') + '</p>'
          ),
          '<p><strong>Ending:</strong> ' + escapeHtml(story.story.ending) + '</p>',
        ].join('');

        document.getElementById('story-choices').innerHTML = story.story.choices.map((choice, index) =>
          '<div class="story-block"><strong>Choice ' + (index + 1) + ' — ' + escapeHtml(choice.label) + '</strong>' +
          '<p>' + escapeHtml(choice.prompt) + '</p>' +
          '<p><strong>Outcome:</strong> ' + escapeHtml(choice.outcome_text) + '</p>' +
          '<p class="muted">Skills: ' + escapeHtml(choice.skill_tags.join(', ')) + '<br />Tone: ' + escapeHtml(choice.tone_tags.join(', ')) + '</p></div>'
        ).join('');

        document.getElementById('caregiver-note').innerHTML =
          '<p><strong>Intended lesson:</strong> ' + escapeHtml(story.caregiver_note.intended_lesson) + '</p>' +
          '<p><strong>Adult guidance:</strong> ' + escapeHtml(story.caregiver_note.adult_guidance) + '</p>' +
          '<p><strong>Suggested follow-up:</strong></p><ul>' +
          story.caregiver_note.suggested_follow_up.map((item) => '<li>' + escapeHtml(item) + '</li>').join('') +
          '</ul><p><strong>Review recommendation:</strong> ' + escapeHtml(story.caregiver_note.review_recommendation) + '</p>';

        document.getElementById('review-flags').innerHTML =
          '<p><strong>Flags:</strong></p>' +
          (story.review_flags.length > 0
            ? '<ul class="pill-list">' + story.review_flags.map((flag) => '<li>' + escapeHtml(flag) + '</li>').join('') + '</ul>'
            : '<p>None</p>') +
          '<p><strong>Requires adult review:</strong> ' + escapeHtml(String(story.metadata.requires_adult_review)) + '</p>' +
          '<p><strong>Generator version:</strong> ' + escapeHtml(story.metadata.generator_version) + '</p>';

        resultElement.textContent = JSON.stringify(payload, null, 2);
      };

      document.getElementById('reset-request').addEventListener('click', () => {
        applyPreset(defaultRequest);
        outputCard.hidden = true;
        resultElement.textContent = '';
      });

      formElement.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        const body = {
          profile_id: String(form.get('profile_id') || '').trim(),
          request: {
            topic: String(form.get('topic') || '').trim(),
            target_skill: String(form.get('target_skill') || '').trim(),
            story_length: String(form.get('story_length') || '').trim(),
            setting: String(form.get('setting') || '').trim() || null,
            desired_tone: String(form.get('desired_tone') || '').trim() || null,
            avoid: uniqueList(splitList(form.get('avoid'))),
          },
        };

        const errors = validateRequest(body);
        if (errors.length > 0) {
          outputCard.hidden = true;
          resultElement.textContent = '';
          setStatus(errors.join(' '), 'error');
          return;
        }

        try {
          setStatus('Generating story…', 'info');
          const response = await fetch('/api/story-requests', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Unable to generate story');
          }
          renderStory(data);
          setStatus('Story generated. Review the child-facing story and caregiver note before use.', 'success');
        } catch (error) {
          outputCard.hidden = true;
          resultElement.textContent = '';
          setStatus(error.message || 'Unable to generate story.', 'error');
        }
      });

      renderPresets();
      applyPreset(defaultRequest);
      if (${profiles.length} === 0) {
        setStatus('Create a child profile first, then come back to generate a story.', 'error');
      }
    </script>
  </body>
</html>`;
}
