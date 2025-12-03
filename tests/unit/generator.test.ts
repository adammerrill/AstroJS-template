import { describe, it, expect } from 'vitest';
import { generateInterface } from '../../scripts/type-gen/mapper';

// Mock Schema resembling a real Storyblok response
const MOCK_HERO_SCHEMA = {
  name: "hero_section",
  schema: {
    headline: {
      type: "text",
      required: true,
      display_name: "Main Headline"
    },
    is_active: {
      type: "boolean",
      description: "Toggle visibility"
    },
    background_image: {
      type: "asset"
    },
    body_copy: {
      type: "richtext"
    }
  }
};

// NEW: Mock Schema for a component with nested blocks
const MOCK_GRID_SCHEMA = {
  name: "grid_section",
  schema: {
    columns: {
      type: "bloks",
      component_whitelist: ["feature", "teaser_card", "hero_section"]
    }
  }
};

describe('Type Generator Mapper', () => {
  // ... existing tests ...
  it('generates correct interface name', () => {
    const output = generateInterface(MOCK_HERO_SCHEMA);
    expect(output).toContain('export interface HeroSectionBlok');
  });

  it('handles required fields correctly', () => {
    const output = generateInterface(MOCK_HERO_SCHEMA);
    expect(output).toMatch(/headline: string;/);
  });

  it('handles optional fields correctly', () => {
    const output = generateInterface(MOCK_HERO_SCHEMA);
    expect(output).toMatch(/is_active\?: boolean;/);
  });

  it('maps custom Storyblok types', () => {
    const output = generateInterface(MOCK_HERO_SCHEMA);
    expect(output).toContain('background_image?: StoryblokAsset;');
    expect(output).toContain('body_copy?: StoryblokRichText;');
  });

  it('includes JSDoc comments', () => {
    const output = generateInterface(MOCK_HERO_SCHEMA);
    expect(output).toContain('* Main Headline');
    expect(output).toContain('* Toggle visibility');
  });
  
  it('includes standard internal fields', () => {
    const output = generateInterface(MOCK_HERO_SCHEMA);
    expect(output).toContain("component: 'hero_section';");
    expect(output).toContain("_uid: string;");
  });

  // NEW: Test for Epic 1.3
  it('generates Union Types for nested blocks', () => {
    const output = generateInterface(MOCK_GRID_SCHEMA);
    // Should map snake_case to PascalCase and join with |
    // (FeatureBlok | TeaserCardBlok | HeroSectionBlok)[]
    expect(output).toContain('columns?: (FeatureBlok | TeaserCardBlok | HeroSectionBlok)[];');
  });
});
