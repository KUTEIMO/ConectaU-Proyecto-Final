import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');

describe('ConectaU Frontend Route Contracts, Accessibility & Print Layout Audit (CON-22 / CON-28 / CON-31)', () => {
  const appTsx = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const indexCss = fs.readFileSync(path.join(ROOT, 'src/styles/index.css'), 'utf8');

  it('CP-UI01: registers all public, protected role-based, and certificate verification routes', () => {
    for (const route of ['path="/"', 'path="/login"', 'path="/register"', 'path="/verify"', 'path="/verify/:id"', 'path="/app"', 'path="/jobs"', 'path="/applications"', 'path="/vacancies"', 'path="/messages"', 'path="/admin"']) {
      assert.ok(appTsx.includes(route), `Missing route ${route} in App.tsx`);
    }
    assert.ok(appTsx.includes("allowedRoles={['student']}"));
    assert.ok(appTsx.includes("allowedRoles={['company']}"));
    assert.ok(appTsx.includes("allowedRoles={['admin']}"));
  });

  it('CP-UI02: enforces HTML language attribute (es), responsive viewport, and non-empty title (WCAG)', () => {
    assert.match(html, /<html\s+lang="es">/i);
    assert.match(html, /<meta\s+name="viewport"/i);
    assert.match(html, /<title>ConectaU[^<]+<\/title>/i);
  });

  it('CP-UI03: includes A4 landscape print rules for official digital certificates', () => {
    assert.match(indexCss, /@media\s+print/);
    assert.match(indexCss, /@page\s*\{[^}]*landscape/);
    assert.ok(indexCss.includes('certificate-print-sheet') || indexCss.includes('#printable-certificate'));
  });
});
