// scripts/verify-schema-parity.ts
/**
 * @file Schema Parity Verification Script
 * @module scripts/verify-schema-parity
 * @classification Internal (CI/CD)
 * @compliance ISO/IEC 25010 (Reliability) - Fault Prevention
 * @author Atom Merrill
 * @version 1.0.0
 *
 * @description
 * Enforces synchronization between the Storyblok CMS schema and the local codebase.
 * This script is designed to run in the CI pipeline (Quality Gate).
 *
 * Logic:
 * 1. Reads the locally committed `.schema-hash` (Source of Truth for code).
 * 2. Fetches the live schema from Storyblok Management API.
 * 3. Calculates the hash of the live schema.
 * 4. Compares hashes.
 *
 * Exit Codes:
 * - 0: Success (Parity Confirmed)
 * - 1: Failure (Schema Drift Detected - Developer must run `pnpm gen:types`)
 */

import { loadSchema } from "./type-gen/fetch-schema";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const CACHE_FILE_PATH = path.resolve(process.cwd(), ".schema-hash");

async function verifyParity() {
  console.log("🔒 Verifying CMS Schema Parity...");

  // 1. Read Local Hash
  let localHash = "";
  try {
    localHash = await fs.readFile(CACHE_FILE_PATH, "utf-8");
  } catch {
    console.error("❌ Local schema hash missing. Run 'pnpm gen:types' locally.");
    process.exit(1);
  }

  // 2. Fetch Live Schema (Reuse logic from fetch-schema.ts)
  // We use a dry-run approach implicitly because loadSchema calculates hash
  const { components } = await loadSchema();
  
  // 3. Calculate Live Hash
  // Note: We duplicate the hash logic here to ensure strict independence
  // from the side-effects of loadSchema (which writes to disk).
  const liveHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(components))
    .digest("hex");

  // 4. Compare
  if (localHash.trim() !== liveHash.trim()) {
    console.error("\n🚨 SCHEMA DRIFT DETECTED 🚨");
    console.error("The live Storyblok schema has changed, but local types are outdated.");
    console.error("---------------------------------------------------------------");
    console.error(`Local Hash: ${localHash}`);
    console.error(`Live Hash:  ${liveHash}`);
    console.error("---------------------------------------------------------------");
    console.error("FIX: Run 'pnpm gen:types' locally and commit the changes.");
    process.exit(1);
  }

  console.log("✅ Schema Parity Confirmed. Types are up to date.");
  process.exit(0);
}

// Execute
verifyParity().catch((err) => {
  console.error("❌ Verification Failed:", err);
  process.exit(1);
});
