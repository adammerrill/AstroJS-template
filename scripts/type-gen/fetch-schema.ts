import StoryblokClient from "storyblok-js-client";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const PERSONAL_TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN;
const CACHE_FILE_PATH = path.resolve(process.cwd(), ".schema-hash");
const TEMP_SCHEMA_PATH = path.resolve(process.cwd(), "scripts/type-gen/temp-schema.json");

const Storyblok = new StoryblokClient({
  oauthToken: PERSONAL_TOKEN,
});

function calculateHash(data: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

/**
 * Wait utility for retries
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches the components schema with exponential backoff retries.
 */
async function fetchComponents(retries = 3, delay = 1000) {
  if (!SPACE_ID || !PERSONAL_TOKEN) {
    throw new Error(
      "❌ Missing Environment Variables: Ensure STORYBLOK_SPACE_ID and STORYBLOK_PERSONAL_TOKEN are set."
    );
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Connecting to Storyblok Management API (Attempt ${i + 1}/${retries})...`);
      const response = await Storyblok.get(`spaces/${SPACE_ID}/components`, {});
      return response.data.components;
    } catch (error: any) {
      const isLastAttempt = i === retries - 1;
      // 429 Too Many Requests or 5xx Server Errors
      if (error?.response?.status === 429 || error?.response?.status >= 500) {
        if (isLastAttempt) throw error;
        const jitter = Math.random() * 200;
        console.warn(`⚠️ API Error ${error.response.status}. Retrying in ${delay}ms...`);
        await wait(delay + jitter);
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error; // Throw immediately for 401/404
    }
  }
}

export async function loadSchema(): Promise<{ components: any[]; hasChanged: boolean }> {
  try {
    const components = await fetchComponents();
    console.log(`✅ Fetched ${components.length} components.`);

    const newHash = calculateHash(components);
    let oldHash = "";
    
    try {
      oldHash = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    } catch {
      // Ignore missing file
    }

    if (newHash === oldHash) {
      console.log("⏸️  Schema unchanged. Skipping generation.");
      return { components, hasChanged: false };
    }

    console.log("⚡ Schema changed! Updating hash...");
    await fs.writeFile(CACHE_FILE_PATH, newHash);
    await fs.writeFile(TEMP_SCHEMA_PATH, JSON.stringify(components, null, 2));

    return { components, hasChanged: true };

  } catch (error) {
    console.error("❌ Schema ingestion failed:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  loadSchema();
}
