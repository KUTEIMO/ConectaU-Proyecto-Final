import type { EscrowStage, Project } from '../types/index.ts';

const VERIFICATION_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generates an unambiguous institutional verification code (e.g. CONECTAU-VAL-A7F9E2).
 */
export const generateVerificationCode = (): string => {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += VERIFICATION_CHARSET.charAt(Math.floor(Math.random() * VERIFICATION_CHARSET.length));
  }
  return `CONECTAU-VAL-${result}`;
};

/**
 * Resolves visual progression step (1..4) and rejection state for simulated escrow tracking.
 */
export const resolveEscrowStep = (
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected' | 'completed',
  stage?: EscrowStage
): { currentStep: 1 | 2 | 3 | 4; isCompleted: boolean; isReview: boolean; isAccepted: boolean; isRejected: boolean } => {
  const isCompleted = status === 'completed' || stage === 'released';
  const isReview = stage === 'review';
  const isAccepted = status === 'accepted' || stage === 'in_progress' || isReview || isCompleted;
  const isRejected = status === 'rejected' || stage === 'refunded';
  const currentStep: 1 | 2 | 3 | 4 = isCompleted ? 4 : isReview ? 3 : isAccepted ? 2 : 1;
  return { currentStep, isCompleted, isReview, isAccepted, isRejected };
};

/**
 * Clamps numeric review ratings into [1, 5].
 */
export const normalizeReviewRating = (rating: number): number => {
  if (Number.isNaN(rating)) return 5;
  return Math.min(Math.max(Math.round(rating), 1), 5);
};

/**
 * Calculates rounded (1 decimal) average score for user reputation profiles.
 */
export const calculateAverageRating = (ratings: number[]): number => {
  if (!ratings.length) return 0;
  const total = ratings.reduce((sum, r) => sum + normalizeReviewRating(r), 0);
  return Number((total / ratings.length).toFixed(1));
};

export const normalizeProjectType = (type: unknown): Project['type'] => {
  if (!type) return 'project';
  const value = String(type).toLowerCase();
  if (value.includes('práctica') || value.includes('practica') || value.includes('practice')) return 'practice';
  return value.includes('proyecto') ? 'project' : (type as Project['type']);
};

export const normalizeProjectStatus = (status: unknown): Project['status'] => {
  if (!status && typeof status !== 'boolean') {
    return 'active';
  }
  const value = typeof status === 'string' ? status.toLowerCase() : status;
  if (value === true) return 'active';
  if (value === false) return 'inactive';
  if (typeof value === 'string') {
    if (value.includes('inactive') || value.includes('inactiv')) return 'inactive';
    if (value.includes('active') || value.includes('activ')) return 'active';
    if (value.includes('closed') || value.includes('cerrad')) return 'closed';
  }
  return 'active';
};

/**
 * Strips keys whose value is `undefined` before persisting to Firestore v10.
 */
export const omitUndefined = <T extends Record<string, unknown>>(payload: T): Partial<T> =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined)) as Partial<T>;

const INSTITUTIONAL_EMAIL_DOMAINS = ['.edu.co', '.edu', 'unisimon.edu.co', 'ufps.edu.co', 'udes.edu.co', 'unipamplona.edu.co'];

export const isInstitutionalEmail = (email: string): boolean => {
  const normalized = String(email || '').trim().toLowerCase();
  const atIndex = normalized.indexOf('@');
  if (atIndex <= 0) return false;
  const domain = normalized.slice(atIndex + 1);
  return INSTITUTIONAL_EMAIL_DOMAINS.some((suffix) => domain === suffix || domain.endsWith(suffix));
};
