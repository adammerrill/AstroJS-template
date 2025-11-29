/**
 * @fileoverview Epic 6 Verification Script (Corrected)
 * @description Validates the Automated QA Pipeline infrastructure.
 * Checks for test fixtures, mock implementations, and visual regression tests.
 * * CHANGES:
 * - Updated regex to accept arguments in `toHaveScreenshot`.
 * - Updated regex to accept `json:` property in route fulfillment.
 */

import fs from 'fs';
import path from 'path';

console.log("🔍 Starting Epic 6 Verification...");

const checks = [
  {
    path: 'tests/fixtures/storyblok-home.json',
    patterns: [/"component": "page"/, /"uuid":/],
    desc: "Storyblok Mock Fixture"
  },
  {
    path: 'tests/e2e/home-mock.spec.ts',
    patterns: [
      /page\.route/,           // Checks for network interception
      /json:\s*homeFixture/    // Checks for fixture usage via json prop
    ],
    desc: "Deterministic Mock Test"
  },
  {
    path: 'tests/e2e/visual.spec.ts',
    patterns: [
      /expect\(page\)\.toHaveScreenshot\(/ // Checks for visual regression (allows args)
    ],
    desc: "Visual Regression Suite"
  }
];

let failed = false;

checks.forEach(check => {
  const filePath = path.resolve(check.path);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${check.path}`);
    failed = true;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const missingPattern = check.patterns.find(p => !p.test(content));

  if (missingPattern) {
    console.error(`❌ ${check.desc} failed pattern check: ${missingPattern}`);
    failed = true;
  } else {
    console.log(`✅ ${check.desc} verified.`);
  }
});

if (failed) {
  console.error("\n❌ Epic 6 Automated QA Pipeline Incomplete.");
  process.exit(1);
}

console.log("\n🎉 Epic 6 Infrastructure Verified!");