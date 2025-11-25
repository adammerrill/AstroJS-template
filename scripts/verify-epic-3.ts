/**
 * @fileoverview Epic 3 Verification Script
 * @description Validates the Design System implementation.
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log("🔍 Starting Epic 3 Verification...");

const cssPath = 'src/styles/global.css';

// 1. Check File Existence
if (!fs.existsSync(cssPath)) {
  console.error(`❌ Missing file: ${cssPath}`);
  process.exit(1);
}

const cssContent = fs.readFileSync(cssPath, 'utf-8');

// 2. Check Key Design System Components (Regex)
const checks = [
  { pattern: /@import "tailwindcss"/, desc: "Tailwind Import" },
  { pattern: /@theme\s*\{/, desc: "Theme Block" },
  { pattern: /--color-primary:\s*hsl\(var\(--primary\)\)/, desc: "Color Mapping" },
  { pattern: /--animate-accordion-down:/, desc: "Animation Tokens" },
  { pattern: /:root\s*\{/, desc: "Root Variables" },
  { pattern: /--background:\s*0\s+0%\s+100%/, desc: "ShadCN Base Tokens" },
  { pattern: /@layer\s+base/, desc: "Base Layer" },
  { pattern: /container-type:\s*inline-size/, desc: "Container Queries" }
];

let failed = false;

checks.forEach(check => {
  if (!check.pattern.test(cssContent)) {
    console.error(`❌ Missing design token: ${check.desc}`);
    failed = true;
  } else {
    console.log(`✅ Verified: ${check.desc}`);
  }
});

if (failed) {
  console.error("\n❌ Design System incomplete.");
  process.exit(1);
}

// 3. Run the specific design system test
console.log("\n🧪 Running Design System Browser Tests...");
try {
  // Only run the design-system spec
  execSync('npx playwright test tests/design-system.spec.ts', { stdio: 'inherit' });
  console.log("\n✅ Browser tests passed.");
} catch {
  console.error("\n❌ Browser tests failed.");
  process.exit(1);
}

console.log("\n🎉 Epic 3 Complete!");