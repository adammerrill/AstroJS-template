#!/bin/bash

# Clear or create the output file
> knowledge_base.txt

# Define exclusions for build artifacts, generated code, and test assets
EXCLUSIONS=(
  # 1. Build and Cache Artifacts (Always Exclude)
  -not -path '*/.astro/*'
  -not -path '*/.git/*'
  -not -path '*/.pnpm-store/*'
  -not -path '*/.vercel/*'
  -not -path '*/dist/*'
  -not -path '*/node_modules/*'
  -not -path '*/playwright-report/*'
  -not -path '*/test-results/*'
  -not -name 'pnpm-lock.yaml'
  -not -name 'knowledge_base.txt'
  -not -name '.DS_Store'
  -not -name '.env*'
  -not -name '*.log'

  # 2. Generated Code, Schemas, and Mocks (Derived Content)
  -not -path '*/generated/*'        # Excludes src/types/generated/
  -not -path '*/lib/mocks.generated.ts'
  -not -path '*/scripts/type-gen/temp-schema.json'
  -not -name 'env.d.ts'              # Excludes generated TypeScript env definition

  # 3. Testing, QA, and Verification Files
  -not -path '*/tests/*'
  -not -path '*/fixtures/*'
  -not -name 'playwright.config.ts'
  -not -name 'playwright.offline.config.ts'
  -not -name 'playwright.visual.config.ts'
  -not -name 'vitest.config.ts'
  -not -name 'vitest.setup.ts'
  -not -name 'setup.ts'
  -not -path '*/scripts/verify-epic-p1-*.ts'
  -not -path '*/scripts/verify-env-injection.js'

  # 4. Redundant/Duplicate Files (CMS Schemas)
  -not -path '*/.storyblok/components/*'
  -not -path '*/storyblok/components/*' # Excludes individual component JSON files
  -not -name 'components.json'          # Excludes root/duplicate component JSON files
  -not -name 'components.*.json'        # Excludes numbered/duplicate component JSON files
  -not -name 'ContactForm copy.svelte'
)

# File extensions to include (Source Code, Config, Docs)
INCLUSIONS=(
  -name '*.astro' -o -name '*.svelte' -o -name '*.ts' -o -name '*.tsx'
  -o -name '*.js' -o -name '*.mjs' -o -name '*.cjs' -o -name '*.json'
  -o -name '*.css' -o -name '*.md' -o -name '*.yml' -o -name '*.yaml'
)

# Find all matching files, apply exclusions, sort, and process
find . -type f "${EXCLUSIONS[@]}" \( "${INCLUSIONS[@]}" \) \
  -print0 | sort -z | while IFS= read -r -d '' file; do
    echo -e "\n\n================================\n FILE: $file \n================================\n" >> knowledge_base.txt
    cat "$file" >> knowledge_base.txt
done

echo "Knowledge base generated successfully!"