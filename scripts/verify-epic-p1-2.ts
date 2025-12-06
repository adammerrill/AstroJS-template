/**
 * @file Epic 2 Verification Script
 * @description Validates the existence and content patterns of the CMS Resilience Layer.
 * Updated to support strict TypeScript patterns (unknown type, generics).
 */

import fs from "fs";

console.log("🔍 Starting Epic 2 Verification...");

const checks = [
  {
    path: "src/lib/storyblok.ts",
    // Regex explanation:
    // 1. matches "getSafeStory" function definition
    // 2. matches "try {" block
    // 3. matches catch block with either "any" or "unknown" type
    patterns: [
      /export\s+async\s+function\s+getSafeStory/,
      /try\s*\{/,
      /catch\s*\(\s*error(?::\s*(?:any|unknown))?\s*\)/,
    ],
    desc: "Safe API Client",
  },
  {
    path: "src/components/fallbacks/FallbackComponent.astro",
    patterns: [/isDev\s*\?/, /Missing Component/],
    desc: "Fallback Component",
  },
  {
    path: "src/pages/[...slug].astro",
    patterns: [
      /getSafeStory(?:<[^>]+>)?\(/, // Matches getSafeStory( or getSafeStory<Type>(
      /Astro\.redirect\(\s*["']\/404["']\s*\)/,
    ],
    desc: "Resilient Routing",
  },
];

let failed = false;

checks.forEach((check) => {
  if (!fs.existsSync(check.path)) {
    console.error(`❌ Missing file: ${check.path}`);
    failed = true;
    return;
  }

  const content = fs.readFileSync(check.path, "utf-8");

  check.patterns.forEach((pattern) => {
    if (!pattern.test(content)) {
      console.error(`❌ ${check.desc} failed pattern match: ${pattern}`);
      failed = true;
    }
  });

  if (!failed) {
    console.log(`✅ ${check.desc} verified.`);
  }
});

if (failed) {
  console.error("\n❌ Epic 2 Failed Verification.");
  process.exit(1);
}

console.log("\n🎉 Epic 2 Complete!");
