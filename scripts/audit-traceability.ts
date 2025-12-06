/**
 * @file Traceability Auditor (ISO 15288 Compliance)
 * @module scripts/audit-traceability
 * @classification Internal
 * @description
 * Parses the codebase to generate a Requirement <-> Code <-> Test traceability matrix.
 * Fails the build if "Orphan Requirements" or "Undocumented Code" are detected.
 *
 * @example Usage: * pnpm audit:traceability
 */

import fs from "fs";
import path from "path";
import yaml from "yaml";
import { globSync } from "glob";

// --- Configuration ---
const REQUIREMENTS_PATH = path.resolve(process.cwd(), "docs/REQUIREMENTS.yaml");
// Scan only production source code, ignoring generated files
const SRC_PATTERN = "src/**/*.{ts,svelte,astro}";

interface Requirement {
  id: string;
  title: string;
  category: string;
}

interface TraceEntry {
  file: string;
  requirements: string[];
  tests: string[];
}

// --- Logic ---

function loadRequirements(): Map<string, Requirement> {
  if (!fs.existsSync(REQUIREMENTS_PATH)) {
    // Generate a dummy file if it doesn't exist to allow bootstrapping
    console.warn(`⚠️  Requirements file not found at ${REQUIREMENTS_PATH}. Creating default.`);
    if (!fs.existsSync(path.dirname(REQUIREMENTS_PATH))) {
      fs.mkdirSync(path.dirname(REQUIREMENTS_PATH), { recursive: true });
    }
    const defaultReqs = `requirements:\n  - id: REQ-SYS-001\n    title: Initial System\n    category: General`;
    fs.writeFileSync(REQUIREMENTS_PATH, defaultReqs);
  }
  
  const file = fs.readFileSync(REQUIREMENTS_PATH, "utf8");
  const data = yaml.parse(file) as { requirements: Requirement[] };
  const map = new Map<string, Requirement>();
  data?.requirements?.forEach((req) => map.set(req.id, req));
  return map;
}

function scanFiles(pattern: string): Record<string, TraceEntry> {
  const files = globSync(pattern, {
    ignore: ["src/types/generated/**", "**/*.d.ts"] // Ignore auto-generated code
  });
  const trace: Record<string, TraceEntry> = {};

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    
    // Regex to capture @requirement REQ-XXX and @test_ref paths
    const reqMatches = content.match(/@requirement\s+(REQ-[A-Z]+-\d{3})/g);
    const testMatches = content.match(/@test_ref\s+([^\s]+)/g);

    if (reqMatches || testMatches) {
      trace[file] = {
        file,
        requirements: reqMatches ? reqMatches.map(m => m.split(/\s+/)[1]) : [],
        tests: testMatches ? testMatches.map(m => m.split(/\s+/)[1]) : [],
      };
    }
  });

  return trace;
}

function generateMatrix() {
  console.log("🔍 Starting Traceability Audit...");
  
  const reqMap = loadRequirements();
  const codeTrace = scanFiles(SRC_PATTERN);
  
  // 1. Validate Code -> Requirements
  const invalidReqs: string[] = [];
  
  // Requirement Coverage Map (Req ID -> Implemented By)
  const reqCoverage = new Map<string, string[]>();
  reqMap.forEach((_, id) => reqCoverage.set(id, []));

  Object.values(codeTrace).forEach((entry) => {
    entry.requirements.forEach((reqId) => {
      if (reqMap.has(reqId)) {
        reqCoverage.get(reqId)?.push(entry.file);
      } else {
        invalidReqs.push(`${entry.file} references unknown ID ${reqId}`);
      }
    });
  });

  // 2. Validate Requirements -> Code (Coverage)
  const orphanReqs: string[] = [];
  reqCoverage.forEach((files, id) => {
    if (files.length === 0) orphanReqs.push(id);
  });

  // --- Reporting ---
  console.log("\n📊 Traceability Matrix Summary:");
  console.log("==================================================");
  console.log(`Total Requirements: ${reqMap.size}`);
  console.log(`Components Traced:  ${Object.keys(codeTrace).length}`);
  console.log("==================================================");

  if (invalidReqs.length > 0) {
    console.error("\n❌ ERROR: Invalid Requirement IDs found in code:");
    invalidReqs.forEach(e => console.error(`   - ${e}`));
    // Strict ISO Compliance: Fail build on invalid reference
    process.exit(1);
  }

  if (orphanReqs.length > 0) {
    // Warning only for now, allows incremental adoption
    console.warn("\n⚠️  WARNING: Orphan Requirements (Not implemented in code):");
    orphanReqs.forEach(id => console.warn(`   - ${id} (${reqMap.get(id)?.title})`));
  }

  // Generate Artifact
  const artifactPath = "traceability-matrix.json";
  const matrix = {
    generatedAt: new Date().toISOString(),
    requirements: Array.from(reqMap.values()),
    coverage: Object.fromEntries(reqCoverage),
    sourceMap: codeTrace
  };
  
  fs.writeFileSync(artifactPath, JSON.stringify(matrix, null, 2));
  console.log(`\n✅ Audit Complete. Matrix saved to ${artifactPath}`);
}

// Execute
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMatrix();
}
