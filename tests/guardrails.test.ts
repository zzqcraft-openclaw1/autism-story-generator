import { describe, expect, it } from 'vitest';
import { analyzeStoryGuardrails } from '../src/guardrails';
import { validStoryOutputFixture } from '../src/fixtures';

describe('Phase 5 guardrails', () => {
  it('accepts the baseline fixture when it satisfies deterministic checks', () => {
    const report = analyzeStoryGuardrails({
      ...validStoryOutputFixture,
      caregiver_note: {
        ...validStoryOutputFixture.caregiver_note,
        adult_guidance: 'Pause after each section, keep your voice steady, and rehearse one calm strategy together before the real event.',
        review_recommendation: 'Adult review is recommended before use, especially if the child is already worried about medical visits.',
      },
      review_flags: ['adult_review_recommended', 'contains_medical_context'],
      metadata: {
        ...validStoryOutputFixture.metadata,
        generator_version: 'phase5-test',
      },
    });

    expect(report.decision).toBe('accept');
    expect(report.should_regenerate).toBe(false);
    expect(report.review_flags).toContain('adult_review_recommended');
  });

  it('requests stronger caregiver review for thinner caregiver notes', () => {
    const report = analyzeStoryGuardrails({
      ...validStoryOutputFixture,
      caregiver_note: {
        ...validStoryOutputFixture.caregiver_note,
        intended_lesson: 'Stay calm.',
        review_recommendation: 'Use carefully.',
      },
    });

    expect(report.decision).toBe('review');
    expect(report.should_regenerate).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toContain('caregiver_lesson_too_thin');
    expect(report.issues.map((issue) => issue.code)).toContain('review_recommendation_unclear');
  });

  it('rejects stories that include avoided or forceful content', () => {
    const report = analyzeStoryGuardrails({
      ...validStoryOutputFixture,
      story_request: {
        ...validStoryOutputFixture.story_request,
        avoid: ['scary details'],
      },
      story: {
        ...validStoryOutputFixture.story,
        sections: [
          {
            id: validStoryOutputFixture.story.sections[0]!.id,
            kind: validStoryOutputFixture.story.sections[0]!.kind,
            text: 'Milo hears scary details and thinks a grown-up will force him to sit still.',
            emotion_labels: [...validStoryOutputFixture.story.sections[0]!.emotion_labels],
            support_cues: [...validStoryOutputFixture.story.sections[0]!.support_cues],
          },
          ...validStoryOutputFixture.story.sections.slice(1),
        ],
      },
    });

    expect(report.decision).toBe('reject');
    expect(report.should_regenerate).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('avoid_term_present');
    expect(report.issues.map((issue) => issue.code)).toContain('discouraged_forceful_language');
  });
});
