import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CITY, VALID_UNIVERSITIES } from '../constants/geo.ts';
import {
  generateVerificationCode,
  resolveEscrowStep,
  normalizeReviewRating,
  calculateAverageRating,
  normalizeProjectStatus,
  normalizeProjectType,
  omitUndefined,
  isInstitutionalEmail,
} from '../utils/domainHelpers.ts';

describe('ConectaU Domain & Validators Unit Tests (RF01-RF11)', () => {
  it('CP-U01: validates regional default city and supported Cúcuta universities', () => {
    assert.equal(DEFAULT_CITY, 'Cúcuta, Norte de Santander, Colombia');
    for (const uni of ['UNISIMON', 'UFPS', 'UDES', 'UNIPAMPLONA']) {
      assert.ok(VALID_UNIVERSITIES.includes(uni), `Missing ${uni}`);
    }
  });

  it('CP-U02: normalizes legacy and multilingual project status and type variants safely', () => {
    assert.equal(normalizeProjectStatus('active'), 'active');
    assert.equal(normalizeProjectStatus('inactive'), 'inactive');
    assert.equal(normalizeProjectStatus('inactiva'), 'inactive');
    assert.equal(normalizeProjectStatus('cerrado'), 'closed');
    assert.equal(normalizeProjectStatus(true), 'active');
    assert.equal(normalizeProjectStatus(false), 'inactive');
    assert.equal(normalizeProjectType('Práctica profesional'), 'practice');
    assert.equal(normalizeProjectType('Proyecto web'), 'project');
  });

  it('CP-U03: generates unambiguous certificate codes (CONECTAU-VAL-XXXXXX) with high uniqueness', () => {
    const generated = new Set();
    const pattern = /^CONECTAU-VAL-[A-HJ-NP-Z2-9]{6}$/;
    for (let i = 0; i < 100; i++) {
      const code = generateVerificationCode();
      assert.match(code, pattern);
      generated.add(code);
    }
    assert.equal(generated.size, 100);
  });

  it('CP-U04: resolves EscrowTracker stages cleanly across pending, accepted, review, completed, and rejected states', () => {
    assert.equal(resolveEscrowStep('pending').currentStep, 1);
    assert.equal(resolveEscrowStep('accepted').currentStep, 2);
    assert.equal(resolveEscrowStep('accepted', 'review').currentStep, 3);
    assert.equal(resolveEscrowStep('completed', 'released').currentStep, 4);
    assert.equal(resolveEscrowStep('rejected').isRejected, true);
    assert.equal(resolveEscrowStep('accepted', 'refunded').isRejected, true);
  });

  it('CP-U05: clamps ratings to [1..5] and computes 1-decimal reputation average (RF10)', () => {
    assert.equal(normalizeReviewRating(0), 1);
    assert.equal(normalizeReviewRating(8), 5);
    assert.equal(normalizeReviewRating(NaN), 5);
    assert.equal(calculateAverageRating([5, 4, 5]), 4.7);
    assert.equal(calculateAverageRating([3, 4]), 3.5);
    assert.equal(calculateAverageRating([]), 0);
  });

  it('CP-U06: validates institutional university email domains for RF01 student registration', () => {
    assert.equal(isInstitutionalEmail('eduardo.soto@lab.unisimon.edu.co'), true);
    assert.equal(isInstitutionalEmail('valeria.contreras@lab.ufps.edu.co'), true);
    assert.equal(isInstitutionalEmail('student@stanford.edu'), true);
    assert.equal(isInstitutionalEmail('persona@gmail.com'), false);
    assert.equal(isInstitutionalEmail('not-an-email'), false);
  });

  it('CP-U07: omits undefined fields cleanly to avoid Firestore v10 Unsupported field value crashes', () => {
    const cleaned = omitUndefined({
      title: 'Backend API',
      salary: undefined,
      minExperience: '1 año',
      deliverableUrl: undefined,
    });
    assert.deepEqual(cleaned, { title: 'Backend API', minExperience: '1 año' });
    assert.equal('salary' in cleaned, false);
  });
});
