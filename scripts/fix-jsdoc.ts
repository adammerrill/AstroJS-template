// scripts/fix-jsdoc.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

/**
 * Tag replacement map based on ISO Compliance Migration Guide.
 */
const TAG_REPLACEMENTS: Record<string, string> = {
  '@changelog': '@version',
  '@fil': '@file',
  '@architecture': '@description Architecture:',
  '@testing_contract': '@description Testing Contract:',
  '@iso_compliance': '@description ISO Compliance:',
  '@critical': '@description ⚠️ CRITICAL:',
  '@reactive': '@description Reactive:',
  '@mutates': '@description Mutates:',
  '@accessed_by': '@description Accessed By:',
  '@exposed_as': '@alias',
  '@states': '@typedef',
  '@lifecycle': '@description Lifecycle:',
  '@flow': '@description Flow:',
  '@error_handling': '@throws',
  '@api_contract': '@description API Contract:',
  '@endpoint': '@description Endpoint:',
  '@route': '@description Route:',
  '@migration': '@description Migration:',
  '@performance': '@description Performance:',
  '@remark': '@description',
  '@warning': '@description ⚠️ WARNING:',
  '@state_management': '@description State Management:',
  '@state': '@type', // Simplified mapping
  '@effect': '@description Effect:',
  '@modernization': '@description Modernization:',
  '@rationale': '@description Rationale:',
  '@antipattern': '@description ⚠️ Anti-pattern:',
  '@critical_timing': '@description Critical Timing:',
  '@production_note': '@description Production Note:',
  '@critical_fix': '@fixme',
  '@type_reference': '@see',
  '@response_structure': '@typedef',
  '@intercepted_by': '@description Intercepted By:',
  '@expected_structure': '@typedef',
  '@navigation_path': '@description Navigation:',
  '@data_structure_navigation': '@description Data Structure:'
};

function fixJSDocTags(content: string): string {
  let fixed = content;

  for (const [oldTag, newTag] of Object.entries(TAG_REPLACEMENTS)) {
    // Regex matches "@tag" followed by content, up to the next tag or end of comment
    // Handles the slash in @fil vs @file correctly
    const regex = new RegExp(
      `${oldTag.replace('/', '\\/')}\\s+(.+?)(?=\\n\\s*\\*\\s*@|\\n\\s*\\*\\/|$)`,
      'g'
    );
    
    fixed = fixed.replace(regex, (match, content) => {
      return `${newTag} ${content}`;
    });
  }

  return fixed;
}

async function main() {
  console.log("🛠️  Starting JSDoc Tag Migration...");
  
  const files = await glob('**/*.{ts,tsx,svelte,astro}', {
    ignore: ['node_modules/**', 'dist/**', '.astro/**', '.output/**']
  });

  console.log(`Found ${files.length} files to scan.`);

  let fixedCount = 0;

  for (const file of files) {
    const original = readFileSync(file, 'utf-8');
    const fixed = fixJSDocTags(original);

    if (fixed !== original) {
      writeFileSync(file, fixed);
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  }

  console.log(`\n✅ Migration Complete. Fixed ${fixedCount} files.`);
}

main().catch(console.error);
