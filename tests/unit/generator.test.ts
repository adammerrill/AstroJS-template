/**
 * @fileoverview Unit tests for type generation functions
 */
import { describe, it, expect } from 'vitest';
import { generateInterface } from '../../scripts/type-gen/mapper';
import { generateZodSchema } from '../../scripts/type-gen/zod-mapper';
import { generateMockFactory } from '../../scripts/type-gen/mock-mapper';
import type { ComponentSchema } from '../../scripts/type-gen/types';

/**
 * Mock component schema for testing
 * This matches the structure returned by the Storyblok Management API
 */
const MOCK_GRID_SCHEMA: ComponentSchema = {
  name: 'feature_grid',
  display_name: 'Feature Grid',
  schema: {
    columns: {
      type: 'bloks',
      component_whitelist: 'feature', // ✅ Comma-separated string (single component)
      restrict_components: 'true', // Note: Storyblok API returns string "true", not boolean
      required: true,
      display_name: 'Features',
    },
  },
};

/**
 * Mock component with multiple whitelisted components
 */
const MOCK_HERO_SCHEMA: ComponentSchema = {
  name: 'hero',
  display_name: 'Hero Section',
  schema: {
    headline: {
      type: 'text',
      required: true,
      display_name: 'Headline',
    },
    cta_buttons: {
      type: 'bloks',
      component_whitelist: 'button,link_button,cta', // ✅ Multiple components separated by commas
      restrict_components: 'true',
      required: false,
    },
  },
};

describe('Type Generation Pipeline', () => {
  describe('generateInterface', () => {
    it('should generate valid TypeScript interface', () => {
      const output = generateInterface(MOCK_GRID_SCHEMA);
      
      expect(output).toContain('export interface FeatureGridBlok');
      expect(output).toContain('_uid: string');
      expect(output).toContain("component: 'feature_grid'");
      expect(output).toContain('columns: (FeatureBlok)[]');
    });

    it('should handle multiple component whitelist', () => {
      const output = generateInterface(MOCK_HERO_SCHEMA);
      
      expect(output).toContain('export interface HeroBlok');
      expect(output).toContain('cta_buttons?: (ButtonBlok | LinkButtonBlok | CtaBlok)[]');
    });

    it('should mark required fields correctly', () => {
      const output = generateInterface(MOCK_HERO_SCHEMA);
      
      expect(output).toContain('headline: string'); // Required - no ?
      expect(output).toContain('cta_buttons?: '); // Optional - has ?
    });
  });

  describe('generateZodSchema', () => {
    it('should generate valid Zod schema', () => {
      const output = generateZodSchema(MOCK_GRID_SCHEMA);
      
      expect(output).toContain('export const FeatureGridBlokSchema');
      expect(output).toContain('z.object({');
      expect(output).toContain('_uid: z.string()');
      expect(output).toContain("component: z.literal('feature_grid')");
    });

    it('should handle nested bloks with lazy loading and respect whitelist', () => {
      const output = generateZodSchema(MOCK_GRID_SCHEMA);
      
      expect(output).toContain('z.array(z.lazy(() => FeatureBlokSchema))');
    });
    
    it('should handle unrestricted bloks with generic component schema', () => {
      // Create a schema WITHOUT component_whitelist to test fallback behavior
      const unrestrictedSchema: ComponentSchema = {
        name: 'grid',
        display_name: 'Grid',
        schema: {
          columns: {
            type: 'bloks',
            // Intentionally no component_whitelist - should fall back to generic
            required: true,
          },
        },
      };
      
      const output = generateZodSchema(unrestrictedSchema);
      
      // When no whitelist, use the generic union schema
      expect(output).toContain('z.array(z.lazy(() => StoryblokComponentSchema))'); // ✅ Correct expectation
    });
  });

  describe('generateMockFactory', () => {
    it('should generate valid mock factory function', () => {
      const output = generateMockFactory(MOCK_GRID_SCHEMA);
      
      expect(output).toContain('feature_grid: (overrides?: Partial<Types.FeatureGridBlok>)');
      expect(output).toContain('_uid: faker.string.uuid()');
      expect(output).toContain("component: 'feature_grid'");
    });
  });
});
