import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');

describe('ConectaU Firebase Security Rules, RBAC Hardening, Append-Only & Indexes Audit (RNF02)', () => {
  const rules = fs.readFileSync(path.join(ROOT, 'firestore.rules'), 'utf8');
  const storageRules = fs.readFileSync(path.join(ROOT, 'storage.rules'), 'utf8');
  const indexesRaw = fs.readFileSync(path.join(ROOT, 'firestore.indexes.json'), 'utf8');
  const firebaseJsonRaw = fs.readFileSync(path.join(ROOT, 'firebase.json'), 'utf8');
  const gitignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');

  it('CP-S01: enforces Append-Only immutability (allow delete: if false) on critical collections', () => {
    for (const coll of [
      'users',
      'projects',
      'applications',
      'notifications',
      'certificates',
      'reviews',
      'support_tickets',
    ]) {
      assert.ok(rules.includes(`match /${coll}/`), `Missing collection rule for ${coll}`);
    }
    const deleteFalseMatches = rules.match(/allow\s+(update,\s*)?delete:\s*if\s*false\s*;/g) || [];
    assert.ok(
      deleteFalseMatches.length >= 7,
      `Expected >=7 immutable delete-blocking rules, found ${deleteFalseMatches.length}`
    );
  });

  it('CP-S02: permits public read on /certificates for external employer verification (/verify/:id) and blocks tampering', () => {
    const certSectionMatch = rules.match(/match \/certificates\/\{certificateId\}\s*\{([\s\S]*?)\}/);
    assert.ok(certSectionMatch, 'Missing /certificates rule block');
    assert.match(certSectionMatch[1], /allow\s+read:\s*if\s+true\s*;/);
    assert.match(certSectionMatch[1], /hasRole\('company'\)\s*\|\|\s*hasRole\('admin'\)/);
    assert.match(certSectionMatch[1], /allow\s+update,\s*delete:\s*if\s+false\s*;/);
  });

  it('CP-S03: requires authentication and participant membership for conversations, messages, and scoped storage', () => {
    assert.match(rules, /match \/conversations\/\{conversationId\}/);
    assert.match(rules, /request\.auth\.uid in resource\.data\.participants/);
    assert.match(storageRules, /request\.auth != null/);
    assert.match(storageRules, /request\.auth\.uid == userId/);
    assert.match(storageRules, /10 \* 1024 \* 1024/);
  });

  it('CP-S04: blocks admin self-escalation on /users create and prevents student self-verification', () => {
    const usersMatch = rules.match(/match \/users\/\{userId\}\s*\{([\s\S]*?)\n    \}/);
    assert.ok(usersMatch, 'Missing /users rule block');
    assert.match(usersMatch[1], /role in \['student', 'company'\]/);
    assert.match(usersMatch[1], /isVerified', false\) == false/);
    assert.match(usersMatch[1], /hasRole\('admin'\)/);
  });

  it('CP-S05: allows controlled workflow updates for escrowStage, deliverables, ratingAverage, and admin curation', () => {
    assert.match(rules, /escrowStage[\s\S]*certificateId[\s\S]*completedAt/);
    assert.match(rules, /deliverableUrl[\s\S]*deliverableNotes/);
    assert.match(rules, /ratingAverage[\s\S]*ratingsCount/);
    assert.match(rules, /match \/support_tickets\/\{ticketId\}/);
  });

  it('CP-S06: defines valid composite indexes in firestore.indexes.json for ordered queries', () => {
    const indexesJson = JSON.parse(indexesRaw);
    assert.ok(Array.isArray(indexesJson.indexes) && indexesJson.indexes.length >= 7);
    const groups = new Set(indexesJson.indexes.map((i) => i.collectionGroup));
    for (const g of ['applications', 'conversations', 'reviews', 'notifications']) {
      assert.ok(groups.has(g), `Missing composite index for ${g}`);
    }
  });

  it('CP-S07: validates SPA rewrites, security headers in firebase.json, and secret exclusions in .gitignore', () => {
    const fb = JSON.parse(firebaseJsonRaw);
    assert.equal(fb.hosting.public, 'dist');
    assert.ok(Array.isArray(fb.hosting.rewrites) && fb.hosting.rewrites.some((r) => r.destination === '/index.html'));
    const allHeaders = fb.hosting.headers.flatMap((h) => h.headers.map((x) => `${x.key}:${x.value}`));
    assert.ok(allHeaders.includes('X-Frame-Options:DENY'));
    assert.ok(allHeaders.includes('X-Content-Type-Options:nosniff'));
    for (const secretPattern of ['.env', '.env.production', 'serviceAccountKey.json', '*firebase-admin*.json']) {
      assert.ok(gitignore.includes(secretPattern), `Missing .gitignore rule for ${secretPattern}`);
    }
  });
});
