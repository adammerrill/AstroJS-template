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

// Helper to infer schema name from component key
function getSchemaName(key: string) {
  return `${toPascalCase(key)}BlokSchema`;
}

describe('Pipeline Integrity: Schema-Mock Parity', () => {
  const components = Object.keys(MockFactory) as Array<keyof typeof MockFactory>;

  it.each(components)('Mock for %s satisfies Zod Schema', (componentKey) => {
    // 1. Generate a fresh mock for this component
    const mockData = MockFactory[componentKey]();
    
    // 2. Resolve the corresponding Zod Schema
    const schemaName = getSchemaName(componentKey);
    // @ts-ignore - dynamic access to module exports
    const schema = Schemas[schemaName];

    if (!schema) {
      throw new Error(`Schema not found for ${schemaName}. Check naming consistency.`);
    }

    // 3. Validate
    const result = schema.safeParse(mockData);

    // 4. Assert
    if (!result.success) {
      console.error(`Validation failed for ${componentKey}:`, result.error.format());
    }
    expect(result.success).toBe(true);
  });
});
