import { describe, expect, it } from 'vitest';
import { handleRequest } from '../src/server/app';

describe('Server app shell', () => {
  it('renders the child profile page with explicit edit guidance', async () => {
    const response = await handleRequest(new Request('http://example.test/'));
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('Edit child profile');
    expect(html).toContain('Only the fields in this form change; the rest of the saved profile stays intact.');
    expect(html).toContain('Delete selected profile');
    expect(html).toContain('Save profile updates');
  });

  it('renders the story request page with presets and separated review sections', async () => {
    const response = await handleRequest(new Request('http://example.test/story-request'));
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('Dentist visit');
    expect(html).toContain('Taking turns at the playground');
    expect(html).toContain('Child-facing story');
    expect(html).toContain('Caregiver note');
    expect(html).toContain('Review flags');
    expect(html).toContain('Raw API response');
  });
});
