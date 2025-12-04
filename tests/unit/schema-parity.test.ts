/**
 * @file schema-parity.test.ts
 * @description QA Verification Suite ("The Golden Test")
 * This test iterates over every component in the Generated Mock Factory
 * and validates it against the Generated Zod Schema.
 * * FAILURE HERE MEANS: The mock data generation logic does not match the 
 * strict validation logic, which implies a drift in the type pipeline.
 */

import { describe, it, expect } from 'vitest';
import { MockFactory } from '@/lib/mocks.generated';
import * as Schemas from '@/types/generated/schemas';
import { toPascalCase } from '../../scripts/type-gen/utils';

/**
 * Helper to infer schema name from component key
 * Converts snake_case component names to PascalCase schema names
 * 
 * @param key - Component key from MockFactory (e.g., "pricing_table")
 * @returns Schema name (e.g., "PricingTableBlokSchema")
 */
function getSchemaName(key: string): string {
  return `${toPascalCase(key)}BlokSchema`;
}

describe('Pipeline Integrity: Schema-Mock Parity', () => {
  const components = Object.keys(MockFactory) as Array<keyof typeof MockFactory>;

  it.each(components)('Mock for %s satisfies Zod Schema', (componentKey) => {
    // 1. Generate a fresh mock for this component
    const mockData = MockFactory[componentKey]();
    
    // 2. Resolve the corresponding Zod Schema
    const schemaName = getSchemaName(componentKey);
    
    // @ts-expect-error - Dynamic schema lookup by computed string key
    const schema = Schemas[schemaName];

    if (!schema) {
      throw new Error(`Schema not found for ${schemaName}. Check naming consistency.`);
    }

    // 3. Validate mock data against schema
    const result = schema.safeParse(mockData);

    // 4. Assert validation succeeded
    if (!result.success) {
      
      console.error(`Validation failed for ${componentKey}:`, result.error.format());
    }
    expect(result.success).toBe(true);
  });
});
