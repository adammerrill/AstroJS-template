/**
 * @file Epic 5 Verification Script
 * @description Validates the SEO and GEO infrastructure.
 * Checks for Sitemap integration in Astro config and the existence of a valid robots.txt.
 */

import fs from "fs";
import path from "path";

console.log("🔍 Starting Epic 5 Verification...");

const checks = [
  {
    path: "astro.config.mjs",
    patterns: [
      /import.*sitemap.*from.*@astrojs\/sitemap/, // Import check
      /sitemap\(\)/, // Integration check
    ],
    desc: "Sitemap Integration",
  },
  {
    path: "public/robots.txt",
    patterns: [
      /User-agent: \*/,
      /Sitemap:\s*https:\/\/www\.your-enterprise-domain\.com\/sitemap-index\.xml/,
    ],
    desc: "Robots.txt Configuration",
  },
];

let failed = false;

checks.forEach((check) => {
  const filePath = path.resolve(check.path);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${check.path}`);
    failed = true;
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const missingPattern = check.patterns.find((p) => !p.test(content));

  if (missingPattern) {
    console.error(`❌ ${check.desc} failed pattern check: ${missingPattern}`);
    failed = true;
  } else {
    console.log(`✅ ${check.desc} verified.`);
  }
});

if (failed) {
  console.error("\n❌ Epic 5 GEO & SEO Infrastructure Incomplete.");
  process.exit(1);
}

console.log("\n🎉 Epic 5 Infrastructure Verified!");
