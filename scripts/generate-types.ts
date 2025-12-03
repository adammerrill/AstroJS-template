import { loadSchema } from "./type-gen/fetch-schema";
import { generateInterface } from "./type-gen/mapper";
import { generateZodSchema } from "./type-gen/zod-mapper";
import { generateMockFactory } from "./type-gen/mock-mapper";
import { toPascalCase } from "./type-gen/utils";
import fs from "fs/promises";
import path from "path";
import prettier from "prettier";

const OUT_DIR_TYPES = path.resolve(process.cwd(), "src/types/generated");
const OUT_DIR_LIB = path.resolve(process.cwd(), "src/lib");

const TYPES_FILE = path.join(OUT_DIR_TYPES, "storyblok.d.ts");
const SCHEMAS_FILE = path.join(OUT_DIR_TYPES, "schemas.ts");
const MOCKS_FILE = path.join(OUT_DIR_LIB, "mocks.generated.ts");

async function main() {
  console.log("🚀 Starting Type, Schema & Mock Generation Pipeline...");

  const { components } = await loadSchema();

  console.log("🛠️  Generating artifacts...");

  // 1. Generate Types
  const interfaces = components.map(generateInterface).join("\n\n");
  const componentNames = components.map((c: any) => toPascalCase(c.name) + 'Blok');
  
  const unionType = componentNames.length > 0 
    ? `export type StoryblokComponent = ${componentNames.join(" | ")};`
    : `export type StoryblokComponent = never;`;

  const typesContent = `/**
 * 🤖 AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: Storyblok Management API
 */
import type { StoryblokAsset, StoryblokLink, StoryblokRichText } from '@/types/storyblok';

${interfaces}

${unionType}
`;

  // 2. Generate Zod Schemas
  const zodSchemas = components.map(generateZodSchema).join("\n");
  const schemaNames = components.map((c: any) => toPascalCase(c.name) + 'BlokSchema');
  
  const zodUnion = schemaNames.length > 0
    ? `export const StoryblokComponentSchema: z.ZodType<any> = z.union([
  ${schemaNames.join(",\n  ")}
]);`
    : `export const StoryblokComponentSchema: z.ZodType<any> = z.any();`;

  const schemasContent = `/**
 * 🤖 AUTO-GENERATED ZOD SCHEMAS. DO NOT EDIT.
 */
import { z } from 'zod';

${zodSchemas}

${zodUnion}
`;

  // 3. Generate Mock Factory
  const mockFunctions = components.map(generateMockFactory).join("\n");
  
  // FIX: Changed import from '@/' alias to relative path '../types/generated/storyblok'
  // This ensures the file works even without specific tsconfig path resolution context
  const mocksContent = `/**
 * 🤖 AUTO-GENERATED MOCK FACTORY. DO NOT EDIT.
 */
import { faker } from '@faker-js/faker';
import type * as Types from '../types/generated/storyblok';

export const MockFactory = {
${mockFunctions}
};
`;

  // 4. Formatting & Writing
  const prettierConfig = await prettier.resolveConfig(process.cwd()) || {};
  
  const formattedTypes = await prettier.format(typesContent, { ...prettierConfig, parser: "typescript" });
  const formattedSchemas = await prettier.format(schemasContent, { ...prettierConfig, parser: "typescript" });
  const formattedMocks = await prettier.format(mocksContent, { ...prettierConfig, parser: "typescript" });

  await fs.mkdir(OUT_DIR_TYPES, { recursive: true });
  await fs.mkdir(OUT_DIR_LIB, { recursive: true });
  
  await fs.writeFile(TYPES_FILE, formattedTypes);
  console.log(`✨ Types generated: ${TYPES_FILE}`);
  
  await fs.writeFile(SCHEMAS_FILE, formattedSchemas);
  console.log(`✨ Schemas generated: ${SCHEMAS_FILE}`);

  await fs.writeFile(MOCKS_FILE, formattedMocks);
  console.log(`✨ Mocks generated: ${MOCKS_FILE}`);
  
  // Note: We skip running 'tsc' on individual files here because it fails 
  // without full project context (tsconfig paths). 
  // The 'pnpm check' command in the main pipeline will handle validation.
}

main().catch((err) => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
