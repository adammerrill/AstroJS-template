/**
 * @file Epic 4 Verification Script
 * @description Validates the existence and structure of Core Architecture components.
 * Checks for SEO integration, Layout structure, and Svelte 5 Runes syntax.
 */

import fs from "fs";

console.log("🔍 Starting Epic 4 Verification...");

const checks = [
  {
    path: "src/components/system/SEOHead.astro",
    patterns: [
      /import.*Schema.*from.*astro-seo-schema/, // Checks for Schema.org integration
      /<title>\{title\}<\/title>/, // Checks for dynamic title
    ],
    desc: "SEO Head System",
  },
  {
    path: "src/layouts/Layout.astro",
    patterns: [
      /import.*SEOHead.*from/, // Must use the SEO component
      /id="skip-nav"/, // Accessibility requirement
      /<slot \/>/, // Must render children
    ],
    desc: "Base Layout Shell",
  },
  {
    path: "src/components/ui/Button.svelte",
    patterns: [
      /\$props/, // Svelte 5 Runes syntax check (supports generics)
      /onclick/, // Native event handling (not on:click)
    ],
    desc: "Svelte 5 Button Primitive",
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
  const missingPattern = check.patterns.find((p) => !p.test(content));

  if (missingPattern) {
    console.error(`❌ ${check.desc} failed pattern check: ${missingPattern}`);
    failed = true;
  } else {
    console.log(`✅ ${check.desc} verified.`);
  }
});

if (failed) {
  console.error("\n❌ Epic 4 Component Architecture Incomplete.");
  process.exit(1);
}

console.log("\n🎉 Epic 4 Structure Verified!");
