import type { StoryOutput } from './schemas/index.ts';

export type GuardrailDecision = 'accept' | 'review' | 'reject';
export type GuardrailSeverity = 'info' | 'warning' | 'critical';
export type GuardrailCategory = 'structure' | 'caregiver_note' | 'review_flags' | 'style' | 'safety';

export interface GuardrailIssue {
  code: string;
  category: GuardrailCategory;
  severity: GuardrailSeverity;
  message: string;
}

export interface StoryGuardrailReport {
  decision: GuardrailDecision;
  issues: GuardrailIssue[];
  warnings: string[];
  review_flags: string[];
  summary: string;
  should_regenerate: boolean;
  requires_caregiver_review: boolean;
}

const discouragedTerms = [
  { code: 'discouraged_forceful_language', term: 'force', severity: 'critical' as const, message: 'Contains force-based language that should be regenerated.' },
  { code: 'discouraged_punitive_language', term: 'punish', severity: 'critical' as const, message: 'Contains punitive language that should be regenerated.' },
  { code: 'discouraged_shame_language', term: 'bad kid', severity: 'critical' as const, message: 'Contains shaming language that should be regenerated.' },
  { code: 'discouraged_threat_language', term: 'threat', severity: 'critical' as const, message: 'Contains threat-based language that should be regenerated.' },
  { code: 'discouraged_absolute_language', term: 'must always', severity: 'warning' as const, message: 'Contains rigid absolute language that needs caregiver review.' },
  { code: 'discouraged_never_language', term: 'never', severity: 'warning' as const, message: 'Contains absolute wording that may need caregiver softening.' },
];

export function analyzeStoryGuardrails(story: StoryOutput): StoryGuardrailReport {
  const issues: GuardrailIssue[] = [];
  const generatedFlags = new Set<string>(story.review_flags);

  const combinedStoryText = [
    story.title,
    story.story.summary,
    story.story.opening,
    ...story.story.sections.map((section) => section.text),
    ...story.story.sections.flatMap((section) => section.support_cues),
    ...story.story.choices.flatMap((choice) => [choice.label, choice.prompt, choice.outcome_text]),
    story.story.ending,
    story.caregiver_note.intended_lesson,
    story.caregiver_note.adult_guidance,
    ...story.caregiver_note.suggested_follow_up,
    story.caregiver_note.review_recommendation,
  ].join(' ').toLowerCase();

  if (!story.story.structure.includes('guided_branching')) {
    issues.push({
      code: 'unexpected_story_structure',
      category: 'structure',
      severity: 'critical',
      message: 'Story structure is not the expected guided branching format.',
    });
    generatedFlags.add('guardrail_structure_unexpected');
  }

  if (story.story.sections.length < 2) {
    issues.push({
      code: 'too_few_sections',
      category: 'structure',
      severity: 'critical',
      message: 'Story needs at least 2 sections for setup and support.',
    });
    generatedFlags.add('guardrail_sections_too_few');
  }

  if (story.story.choices.length < 1 || story.story.choices.length > 3) {
    issues.push({
      code: 'invalid_branch_count',
      category: 'structure',
      severity: 'critical',
      message: 'Story must have between 1 and 3 choices.',
    });
    generatedFlags.add('guardrail_branch_count_invalid');
  }

  if (story.metadata.branch_count !== story.story.choices.length) {
    issues.push({
      code: 'branch_count_mismatch',
      category: 'structure',
      severity: 'critical',
      message: 'metadata.branch_count does not match the actual number of choices.',
    });
    generatedFlags.add('guardrail_branch_count_mismatch');
  }

  if (story.caregiver_note.intended_lesson.trim().length < 20) {
    issues.push({
      code: 'caregiver_lesson_too_thin',
      category: 'caregiver_note',
      severity: 'warning',
      message: 'Caregiver intended lesson is too brief to be useful.',
    });
    generatedFlags.add('guardrail_caregiver_note_thin');
  }

  if (story.caregiver_note.adult_guidance.trim().length < 30) {
    issues.push({
      code: 'adult_guidance_too_thin',
      category: 'caregiver_note',
      severity: 'critical',
      message: 'Adult guidance is too brief and should be expanded before use.',
    });
    generatedFlags.add('guardrail_adult_guidance_thin');
  }

  if (story.caregiver_note.suggested_follow_up.length < 2) {
    issues.push({
      code: 'follow_up_too_short',
      category: 'caregiver_note',
      severity: 'warning',
      message: 'Caregiver note should include at least 2 follow-up suggestions.',
    });
    generatedFlags.add('guardrail_follow_up_thin');
  }

  if (!/review/i.test(story.caregiver_note.review_recommendation)) {
    issues.push({
      code: 'review_recommendation_unclear',
      category: 'caregiver_note',
      severity: 'warning',
      message: 'Caregiver note should explicitly mention review guidance.',
    });
    generatedFlags.add('guardrail_review_guidance_unclear');
  }

  if (story.metadata.requires_adult_review && !generatedFlags.has('adult_review_recommended')) {
    issues.push({
      code: 'missing_adult_review_flag',
      category: 'review_flags',
      severity: 'warning',
      message: 'Adult review is required in metadata but not clearly flagged for reviewers.',
    });
    generatedFlags.add('adult_review_recommended');
  }

  for (const avoidItem of story.story_request.avoid) {
    const normalized = avoidItem.trim().toLowerCase();
    if (normalized && combinedStoryText.includes(normalized)) {
      issues.push({
        code: 'avoid_term_present',
        category: 'safety',
        severity: 'critical',
        message: `Story includes requested avoid content: "${avoidItem}".`,
      });
      generatedFlags.add(`avoid_term_present_${slugify(normalized)}`);
    }
  }

  for (const term of discouragedTerms) {
    if (combinedStoryText.includes(term.term)) {
      issues.push({
        code: term.code,
        category: 'style',
        severity: term.severity,
        message: term.message,
      });
      generatedFlags.add(term.code);
    }
  }

  if (!story.story.tone_tags.includes('predictable')) {
    issues.push({
      code: 'predictability_tag_missing',
      category: 'style',
      severity: 'warning',
      message: 'Story tone tags should include predictable for this MVP safety mode.',
    });
    generatedFlags.add('guardrail_predictable_tag_missing');
  }

  const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
  const decision: GuardrailDecision = criticalCount > 0 ? 'reject' : warningCount > 0 ? 'review' : 'accept';

  const summary =
    decision === 'accept'
      ? 'Guardrails passed. Story is acceptable for caregiver review and use in the MVP flow.'
      : decision === 'review'
        ? `Guardrails found ${warningCount} warning${warningCount === 1 ? '' : 's'}. Caregiver review should be strengthened before use.`
        : `Guardrails found ${criticalCount} critical issue${criticalCount === 1 ? '' : 's'}. Story should be rejected and regenerated.`;

  return {
    decision,
    issues,
    warnings: issues.filter((issue) => issue.severity !== 'info').map((issue) => issue.message),
    review_flags: Array.from(generatedFlags).sort(),
    summary,
    should_regenerate: decision === 'reject',
    requires_caregiver_review: decision !== 'accept' || story.metadata.requires_adult_review,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'general';
}
