/**
 * audit-styles.js
 * A minimal regex-based static analysis tool for Astro/Tailwind projects.
 */
import fs from 'fs';
import path from 'path';

// Configuration
const TARGET_DIRS = ['src/components', 'src/layouts', 'src/pages', 'src/storyblok'];
const EXTENSIONS = ['.astro', '.svelte', '.vue', '.jsx', '.tsx'];

function scanDirectory(dir, fileList = []) {
  // Ensure directory exists before trying to read it
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (EXTENSIONS.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const stats = {
    path: filePath,
    classCount: 0,
    inlineStyles: 0,
    styleTags: 0,
    arbitraryValues: 0,
    riskScore: 'Low'
  };

  // Regex Patterns
  const classRegex = /class(Ph)?Name\s*=\s*["']([^"']+)["']|class\s*=\s*["']([^"']+)["']/g;
  const styleRegex = /style\s*=\s*["']([^"']+)["']/g;
  const styleTagRegex = /<style/g;
  const arbitraryRegex = /-\[.+?\]/g; // Matches tailwind arbitrary values like w-[50px]

  // Analysis
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    stats.classCount++;
    const classes = match[2] || match[3];
    if (classes && arbitraryRegex.test(classes)) stats.arbitraryValues++;
  }
  
  while ((match = styleRegex.exec(content)) !== null) stats.inlineStyles++;
  if (styleTagRegex.test(content)) stats.styleTags++;

  // Risk Calculation
  if (stats.styleTags > 0 || stats.inlineStyles > 2) stats.riskScore = 'High';
  else if (stats.arbitraryValues > 5) stats.riskScore = 'Medium';

  return stats;
}

// Execution
console.log('--- STAGE 0: Local Repo Scan ---');
const allFiles = TARGET_DIRS.flatMap(dir => {
    return scanDirectory(dir);
});

const report = allFiles.map(analyzeFile);

if (report.length === 0) {
    console.log("No files found matching criteria.");
} else {
    console.table(report);
}