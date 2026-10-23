export interface CreationDraftFields {
  type: string;
  question: string;
  rule: string;
  deadline: string;
  outcomes: string;
  unit: string;
  lower: string;
  upper: string;
}
export function validCreationDraft(fields: CreationDraftFields, now = Date.now()): boolean {
  if (!['categorical', 'multi-categorical', 'scalar', 'multi-scalar'].includes(fields.type)) return false;
  if (fields.question.trim().length < 10 || fields.question.trim().length > 300 || fields.rule.trim().length < 15 || !(Date.parse(fields.deadline) > now)) return false;
  if (fields.type.includes('scalar')) return Boolean(fields.unit.trim() && fields.lower.trim() && fields.upper.trim() && Number.isFinite(Number(fields.lower)) && Number.isFinite(Number(fields.upper)) && Number(fields.upper) > Number(fields.lower));
  const answers = fields.outcomes.split('\n').map((item) => item.trim()).filter(Boolean);
  return answers.length >= 2 && new Set(answers.map((item) => item.toLowerCase())).size === answers.length;
}
