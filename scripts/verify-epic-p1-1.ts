/**
 * @fileoverview Epic 1 Verification Script (v1.0.4)
 * @description Validates dependencies, Astro config output, Tailwind CSS generation, and Storyblok presence.
 * Includes robust error handling for build process failures.
 */

import fs from "fs";
import { execSync } from "child_process";

const requiredDeps = [
  "astro",
  "svelte",
  "@astrojs/svelte",
  "@astrojs/node",
  "tailwindcss",
  "@tailwindcss/vite",
  "@storyblok/astro",
];

const forbiddenDeps = [
  "@astrojs/tailwind", // Legacy integration must be gone
];

console.log("🔍 Starting Epic 1 Verification (v4 + Storyblok Fix)...");

// 1. Check Dependencies
console.log("Checking dependencies...");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

const missingDeps = requiredDeps.filter((dep) => !allDeps[dep]);
const foundForbidden = forbiddenDeps.filter((dep) => allDeps[dep]);

if (missingDeps.length > 0) {
  console.error(`❌ Missing dependencies: ${missingDeps.join(", ")}`);
  process.exit(1);
}

if (foundForbidden.length > 0) {
  console.error(
    `❌ Forbidden legacy dependencies found: ${foundForbidden.join(", ")}`,
  );
  process.exit(1);
}

console.log("✅ Dependencies correct.");

// 2. Verify Astro Config Mode
console.log("Verifying Astro SSR configuration...");
const astroConfig = fs.readFileSync("astro.config.mjs", "utf-8");

if (!astroConfig.includes('output: "server"')) {
  console.error("❌ Astro config missing 'output: \"server\"'");
  process.exit(1);
}
if (astroConfig.includes("@astrojs/tailwind")) {
  console.error("❌ Legacy @astrojs/tailwind import found in config.");
  process.exit(1);
}
if (!astroConfig.includes("@tailwindcss/vite")) {
  console.error("❌ Missing @tailwindcss/vite import in config.");
  process.exit(1);
}
if (!astroConfig.includes("storyblok({")) {
  console.error("❌ Missing storyblok integration in config.");
  process.exit(1);
}
if (!astroConfig.includes("loadEnv")) {
  console.error("❌ Missing loadEnv for Storyblok token.");
  process.exit(1);
}

console.log(
  "✅ Astro SSR, Tailwind Vite plugin, and Storyblok integration configured correctly.",
);

// 3. Build Test
console.log("Running build test...");
try {
  // We suppress stdio to clean up output unless it fails
  execSync("pnpm build", { stdio: "pipe" });
  console.log("✅ Build successful.");
} catch (error: unknown) {
  console.error("❌ Build failed.");
  // Type guard to safely access error properties
  if (error && typeof error === "object" && "stdout" in error) {
    const execError = error as { stdout?: Buffer; stderr?: Buffer };
    if (execError.stdout) console.error(execError.stdout.toString());
    if (execError.stderr) console.error(execError.stderr.toString());
  }
  process.exit(1);
}

console.log("🎉 Epic 1 Complete!");
