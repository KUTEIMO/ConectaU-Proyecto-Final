import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CITY,
  VALID_UNIVERSITIES,
  DEFAULT_MODALITIES,
  formatSalaryRange,
} from '../constants/geo.ts';
import {
  generateVerificationCode,
  resolveEscrowStep,
  normalizeReviewRating,
  calculateAverageRating,
  normalizeProjectType,
  normalizeProjectStatus,
} from '../utils/domainHelpers.ts';

describe('ConectaU Domain & Validators Unit Tests (RF02-RF11)', () => {
  it('CP-U01: validates regional default city and supported Cúcuta universities', () => {
    assert.equal(DEFAULT_CITY, 'Cúcuta, Norte de Santander, Colombia');
    assert.deepEqual([...VALID_UNIVERSITIES], ['UNISIMON', 'UFPS', 'UDES', 'UNIPAMPLONA']);
    assert.deepEqual([...DEFAULT_MODALITIES], ['remote', 'hybrid', 'on-site']);
  });

  it('CP-U02: formats compensation salary range correctly across edge cases', () => {
    assert.equal(formatSalaryRange(), undefined);
    assert.equal(formatSalaryRange('$800.000', undefined), '$800.000');
    assert.equal(formatSalaryRange(undefined, '$1.200.000'), '$1.200.000');
    assert.equal(formatSalaryRange('$800.000 COP', '$1.200.000 COP'), '$800.000 COP - $1.200.000 COP');
  });

  it('CP-U03: generates unambiguous certificate codes (CONECTAU-VAL-XXXXXX) with high uniqueness', () => {
    const pattern = /^CONECTAU-VAL-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/;
    const generated = new Set();
    for (let i = 0; i < 1000; i++) {
      const code = generateVerificationCode();
      assert.match(code, pattern);
      generated.add(code);
    }
    assert.ok(generated.size >= 995, `Expected near-unique codes, got ${generated.size}/1000`);
  });

  it('CP-U04: resolves EscrowTracker stages cleanly across pending, accepted, review, completed, and rejected states', () => {
    assert.deepEqual(resolveEscrowStep('pending', 'deposited'), {
      currentStep: 1,
      isCompleted: false,
      isReview: false,
      isAccepted: false,
      isRejected: false,
    });
    assert.equal(resolveEscrowStep('accepted', 'in_progress').currentStep, 2);
    assert.equal(resolveEscrowStep('accepted', 'review').currentStep, 3);
    assert.equal(resolveEscrowStep('completed', 'released').currentStep, 4);
    assert.equal(resolveEscrowStep('rejected').isRejected, true);
    assert.equal(resolveEscrowStep('pending', 'refunded').isRejected, true);
  });

  it('CP-U05: clamps ratings to [1..5] and computes 1-decimal reputation average (RF10)', () => {
    assert.equal(normalizeReviewRating(0), 1);
    assert.equal(normalizeReviewRating(7), 5);
    assert.equal(normalizeReviewRating(4.4), 4);
    assert.equal(calculateAverageRating([5, 4, 5]), 4.7);
    assert.equal(calculateAverageRating([]), 0);
  });

  it('CP-U06: normalizes project status including inactive without substring false positive', () => {
    assert.equal(normalizeProjectStatus('active'), 'active');
    assert.equal(normalizeProjectStatus('inactive'), 'inactive');
    assert.equal(normalizeProjectStatus('closed'), 'closed');
    assert.equal(normalizeProjectStatus('cerrado'), 'closed');
    assert.equal(normalizeProjectStatus(false), 'inactive');
    assert.equal(normalizeProjectStatus(true), 'active');
    assert.equal(normalizeProjectType('Práctica profesional'), 'practice');
    assert.equal(normalizeProjectType('Proyecto corto'), 'project');
  });
});
