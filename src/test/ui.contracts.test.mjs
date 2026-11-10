import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');

describe('ConectaU Frontend Route Contracts, Feature Wiring & Accessibility Audit (RF01-RF11)', () => {
  const appTsx = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const indexCss = fs.readFileSync(path.join(ROOT, 'src/styles/index.css'), 'utf8');
  const layoutTsx = fs.readFileSync(path.join(ROOT, 'src/components/Layout/Layout.tsx'), 'utf8');
  const applicationsTsx = fs.readFileSync(path.join(ROOT, 'src/pages/Applications.tsx'), 'utf8');
  const viewAppsTsx = fs.readFileSync(path.join(ROOT, 'src/pages/ViewApplications.tsx'), 'utf8');
  const authServiceTs = fs.readFileSync(path.join(ROOT, 'src/services/authService.ts'), 'utf8');

  it('CP-UI01: registers all public, forgot-password, protected role-based, and certificate verification routes', () => {
    for (const routePath of [
      'path="/"',
      'path="/verify"',
      'path="/verify/:id"',
      'path="/legal"',
      'path="/login"',
      'path="/register"',
      'path="/forgot-password"',
      'path="/admin"',
      'path="/vacancies"',
      'path="/talent"',
    ]) {
      assert.ok(appTsx.includes(routePath), `Missing route ${routePath} in App.tsx`);
    }
  });

  it('CP-UI02: enforces HTML language attribute (es), responsive viewport, and non-empty title (WCAG)', () => {
    assert.match(indexHtml, /<html[^>]*lang="es"/i);
    assert.match(indexHtml, /<meta\s+name="viewport"/i);
    assert.match(indexHtml, /<title>.*ConectaU.*<\/title>/i);
  });

  it('CP-UI03: includes landscape print rules and printable certificate anchor', () => {
    assert.match(indexCss, /@media\s+print/);
    assert.match(indexCss, /size:\s*landscape/);
    assert.match(indexCss, /#printable-certificate/);
  });

  it('CP-UI04: verifies SupportModal (PQRS) is wired into authenticated Layout shell', () => {
    assert.ok(layoutTsx.includes('SupportModal'), 'SupportModal must be wired in Layout.tsx');
    assert.ok(layoutTsx.includes('onOpenSupport'), 'Sidebar trigger must wire to SupportModal');
  });

  it('CP-UI05: verifies Deliverables submission (RF09), EscrowTracker (RF07), and Review duplicate guards (RF10)', () => {
    assert.ok(applicationsTsx.includes('submitApplicationDeliverable'), 'Deliverable submission missing in Applications.tsx');
    assert.ok(applicationsTsx.includes('reviewedAppIds'), 'Duplicate review guard missing in Applications.tsx');
    assert.ok(viewAppsTsx.includes('EscrowTracker'), 'EscrowTracker missing in ViewApplications.tsx');
    assert.ok(viewAppsTsx.includes("handleStatusChange(application.id, 'interview')"), 'Interview button missing in ViewApplications.tsx');
  });

  it('CP-UI06: verifies Auth service guarantees id field presence, email verification, and Google profile bootstrap', () => {
    assert.match(authServiceTs, /id:\s*userCredential\.user\.uid/);
    assert.ok(authServiceTs.includes('sendEmailVerification'));
    assert.ok(authServiceTs.includes('ensureGoogleUserProfile'));
  });
});
