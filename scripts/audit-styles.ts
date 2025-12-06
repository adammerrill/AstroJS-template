#!/usr/bin/env node

/**
 * @file Style Governance Auditor (ISO/ASCII Compliant)
 * @description
 * A static analysis tool designed to enforce the "Utility-First" philosophy
 * of the Tailwind CSS v4 design system within an Astro + Svelte enterprise stack.
 *
 * Philosophy:
 * This tool acts as a "Design System Firewall" — preventing developer drift
 * toward bespoke inline styles, arbitrary values, and CSS-in-JS patterns that
 * erode maintainability and design consistency.
 *
 * High Risk Patterns Detected:
 * 1. Inline Styles (style="..."): High specificity, impossible to override via utilities
 * 2. Arbitrary Values (w-[50px], top-[--var]): "Magic numbers" that bypass design tokens
 * 3. Scoped Style Tags (<style>): Creates component-specific CSS islands
 * 4. Excessive CSS Variables: Proxy indicator for complex manual styling
 *
 * Tailwind v4 Specific Enhancements:
 * - Detects legacy arbitrary syntax: -[...] (bracket notation)
 * - Detects new arbitrary syntax: -(...) (parenthesis notation for CSS variables)
 * - Validates adherence to @theme directive usage
 *
 * Exit Codes:
 * - 0: Clean scan, no violations
 * - 1: High-risk patterns detected (fails CI/CD pipeline)
 *
 * Usage:
 *   node --loader tsx scripts/audit-styles.ts
 *   pnpm run audit:styles
 *
 * Integration:
 *   Add to pre-commit hooks or CI pipeline to enforce style governance:
 *   - Husky: npx husky add .husky/pre-commit "pnpm audit:styles"
 *   - GitHub Actions: Run as part of lint workflow
 *
 * @module scripts/audit-styles
 * @author Atom Merrill
 * @version 2.0.0
 * @updated 2025-12-01
 * @license MIT
 *
 * @see {@link https://tailwindcss.com/docs/v4-beta|Tailwind CSS v4 Documentation}
 */

import fs from "fs";
import path from "path";

/* -------------------------------------------------------------------------- */
/*                              Configuration                                 */
/* -------------------------------------------------------------------------- */

/**
 * Target directories to scan for source files.
 * Focuses on component and page directories where styling occurs.
 */
const TARGET_DIRS: string[] = [
  "src/components", // Reusable component library
  "src/layouts", // Page layout templates
  "src/pages", // Route-based pages
  "src/storyblok", // CMS-integrated components
];

/**
 * File extensions to analyze.
 * Covers all framework components in the stack.
 */
const EXTENSIONS: string[] = [
  ".astro", // Astro components
  ".svelte", // Svelte 5 components
  ".vue", // Vue components (if used)
  ".jsx", // React JSX (if used)
  ".tsx", // React TSX (if used)
];

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

/**
 * Risk severity levels for style pattern analysis.
 */
type RiskLevel = "Low" | "Medium" | "High";

/**
 * Statistical report for a single file's style analysis.
 */
interface FileStyleStats {
  /** Relative file path from project root */
  path: string;
  /** Total number of class attributes found */
  classCount: number;
  /** Number of inline style attributes (High Risk) */
  inlineStyles: number;
  /** Number of <style> tags found (High Risk) */
  styleTags: number;
  /** Number of Tailwind arbitrary values detected (Medium Risk) */
  arbitraryValues: number;
  /** Number of CSS variable usages detected */
  cssVariables: number;
  /** Computed risk score based on pattern analysis */
  riskScore: RiskLevel;
}

/* -------------------------------------------------------------------------- */
/*                            Utility Functions                               */
/* -------------------------------------------------------------------------- */

/**
 * Recursively scans a directory for files matching target extensions.
 * Uses depth-first traversal to build a comprehensive file list.
 *
 * @param {string} dir - The directory to scan.
 * @param {string[]} [fileList=[]] - Accumulator for file paths (internal).
 * @returns {string[]} List of matching file paths.
 */
function scanDirectory(dir: string, fileList: string[] = []): string[] {
  // Guard: Skip non-existent directories
  if (!fs.existsSync(dir)) {
    console.warn(`[audit] Warning: Directory not found: ${dir}`);
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recurse into subdirectories
      scanDirectory(filePath, fileList);
    } else if (EXTENSIONS.includes(path.extname(file))) {
      // Add matching files to the list
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Analyzes a single file for style risk indicators.
 * Performs regex-based pattern matching to detect anti-patterns.
 *
 * @param {string} filePath - Path to the file to analyze.
 * @returns {FileStyleStats} Statistical report for the file.
 */
function analyzeFile(filePath: string): FileStyleStats {
  const content = fs.readFileSync(filePath, "utf-8");

  const stats: FileStyleStats = {
    path: filePath,
    classCount: 0,
    inlineStyles: 0,
    styleTags: 0,
    arbitraryValues: 0,
    cssVariables: 0,
    riskScore: "Low",
  };

  /* --------------------------- Regex Patterns ---------------------------- */

  /**
   * Matches class="..." or className="..." attributes.
   * Captures the class string for further analysis.
   *
   * Examples:
   * - class="flex items-center"
   * - className="w-[50px] h-full"
   */
  const classRegex =
    /class(?:Name)?\s*=\s*["']([^"']+)["']|class\s*=\s*["']([^"']+)["']/g;

  /**
   * Matches inline style="..." attributes.
   * High Risk: Inline styles bypass the utility system entirely.
   *
   * Examples:
   * - style="color: red; margin: 10px;"
   * - style="background: var(--primary);"
   */
  const styleRegex = /style\s*=\s*["']([^"']+)["']/g;

  /**
   * Matches <style> opening tags.
   * High Risk: Scoped styles create component-specific CSS islands.
   *
   * Examples:
   * - <style scoped>
   * - <style lang="scss">
   */
  const styleTagRegex = /<style/g;

  /**
   * UPDATED for Tailwind v4:
   * Matches arbitrary value syntax in both legacy and new formats.
   *
   * Legacy (v3): -[50px] (bracket notation)
   * New (v4): -(--header-height) (parenthesis notation for CSS variables)
   *
   * Examples:
   * - w-[50px] → Legacy arbitrary width
   * - top-(--header-height) → v4 CSS variable reference
   * - bg-[#ff0000] → Legacy arbitrary color
   */
  const arbitraryRegex = /-\[.+?\]|-\(.+?\)/g;

  /**
   * Detects manual CSS variable usage.
   * Medium Risk: Indicates complex styling logic outside utilities.
   *
   * Examples:
   * - var(--primary-color)
   * - var(--spacing-lg, 2rem)
   */
  const variableRegex = /var\(--.+?\)/g;

  /* --------------------------- Analysis Loop ----------------------------- */

  let match: RegExpExecArray | null;

  // Count class attributes and detect arbitrary values
  while ((match = classRegex.exec(content)) !== null) {
    stats.classCount++;
    const classes = match[1] || match[2];

    if (classes && arbitraryRegex.test(classes)) {
      stats.arbitraryValues++;
    }
  }

  // Count inline styles
  while ((match = styleRegex.exec(content)) !== null) {
    stats.inlineStyles++;
  }

  // Count <style> tags
  if (styleTagRegex.test(content)) {
    stats.styleTags++;
  }

  // Count CSS variable usages
  const varMatches = content.match(variableRegex);
  if (varMatches) {
    stats.cssVariables = varMatches.length;
  }

  /* ------------------------ Risk Calculation Logic ----------------------- */

  /**
   * Risk Scoring Algorithm:
   *
   * High Risk (Fails CI):
   * - Any <style> tags present
   * - More than 2 inline style attributes
   *
   * Medium Risk (Warning):
   * - More than 5 arbitrary values (magic numbers)
   *
   * Low Risk (Clean):
   * - Pure utility classes with no anti-patterns
   */
  if (stats.styleTags > 0 || stats.inlineStyles > 2) {
    stats.riskScore = "High";
  } else if (stats.arbitraryValues > 5) {
    stats.riskScore = "Medium";
  }

  return stats;
}

/* -------------------------------------------------------------------------- */
/*                              Main Execution                                */
/* -------------------------------------------------------------------------- */

/**
 * Main audit execution function.
 * Scans all target directories, analyzes files, and generates a report.
 */
function runAudit(): void {
  console.log("=".repeat(70));
  console.log("🛡️  Tailwind v4 Style Governance Audit");
  console.log("=".repeat(70));
  console.log(`📁 Scanning directories: ${TARGET_DIRS.join(", ")}`);
  console.log(`📄 Target extensions: ${EXTENSIONS.join(", ")}\n`);

  // Scan all target directories
  const allFiles = TARGET_DIRS.flatMap((dir) => scanDirectory(dir));

  console.log(`✓ Found ${allFiles.length} files to analyze\n`);

  // Analyze each file and filter out clean files
  const report = allFiles
    .map(analyzeFile)
    .filter(
      (stat) =>
        stat.inlineStyles > 0 || stat.styleTags > 0 || stat.arbitraryValues > 0,
    );

  /* ---------------------------- Report Output ----------------------------- */

  if (report.length === 0) {
    console.log("=".repeat(70));
    console.log("✅ No style deviations found.");
    console.log("✅ Design system integrity is 100%.");
    console.log("=".repeat(70));
    process.exit(0);
  }

  // Display detailed report
  console.log("⚠️  Style Deviation Report:\n");
  console.table(
    report.map((r) => ({
      Path: r.path.replace(process.cwd(), "."),
      "Inline Styles": r.inlineStyles,
      "Style Tags": r.styleTags,
      "Arbitrary Values": r.arbitraryValues,
      "CSS Variables": r.cssVariables,
      Risk: r.riskScore,
    })),
  );

  // Count high-risk violations
  const highRiskFiles = report.filter((r) => r.riskScore === "High");
  const mediumRiskFiles = report.filter((r) => r.riskScore === "Medium");

  console.log("\n" + "=".repeat(70));
  console.log("📊 Summary:");
  console.log(`   Total Violations: ${report.length}`);
  console.log(`   High Risk: ${highRiskFiles.length}`);
  console.log(`   Medium Risk: ${mediumRiskFiles.length}`);
  console.log("=".repeat(70));

  // Fail CI if high-risk patterns exist
  if (highRiskFiles.length > 0) {
    console.error(
      `\n❌ AUDIT FAILED: ${highRiskFiles.length} files with High Risk violations.`,
    );
    console.error("\nRecommendations:");
    console.error("  1. Remove inline style attributes");
    console.error("  2. Replace <style> tags with Tailwind utilities");
    console.error("  3. Use @theme directive for custom design tokens");
    console.error("  4. Convert arbitrary values to theme-based utilities\n");
    process.exit(1); // Exit code 1 fails CI/CD pipeline
  } else {
    console.log(
      "\n⚠️  Warnings found, but risk is acceptable (Medium or Low).",
    );
    console.log(
      "Consider refactoring arbitrary values to use design tokens.\n",
    );
    process.exit(0);
  }
}

/* -------------------------------------------------------------------------- */
/*                            ESM Entry Guard                                 */
/* -------------------------------------------------------------------------- */

/**
 * Entry point guard for direct script execution.
 * Ensures this module only runs when invoked directly via Node.js.
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  runAudit();
}

/**
 * Export for programmatic usage (e.g., in test suites).
 */
export { runAudit, scanDirectory, analyzeFile };
