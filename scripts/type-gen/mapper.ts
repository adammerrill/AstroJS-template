import { toPascalCase, cleanFieldName } from './utils';
import type { ComponentSchema, SchemaField } from "./types";

/**
 * Maps Storyblok field types to TypeScript types
 * 
 * @param field - The schema field to map
 * @returns TypeScript type string representation
 */
function mapFieldType(field: SchemaField): string {
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'markdown':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'richtext':
      return 'StoryblokRichText';
    case 'asset':
      return 'StoryblokAsset';
    case 'multilink':
      return 'StoryblokLink';
    case 'bloks':
      // Handle restricted component types
      // CRITICAL FIX: Check if component_whitelist exists, regardless of restrict_components flag
      // In practice, if component_whitelist is set, we should use it for better type safety
      if (field.component_whitelist) {
        // CRITICAL FIX: Handle both string and array types
        // Storyblok API returns comma-separated string, but we support array too
        let whitelist: string[];
        
        if (Array.isArray(field.component_whitelist)) {
          whitelist = field.component_whitelist;
        } else {
          // Split comma-separated string and trim whitespace
          whitelist = field.component_whitelist
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        }
        
        if (whitelist.length > 0) {
          const allowedTypes = whitelist
            .map((name: string) => toPascalCase(name) + 'Blok')
            .join(' | ');
          return `(${allowedTypes})[]`;
        }
      }
      // Use StoryblokComponent[] instead of any[] for unrestricted bloks
      return 'StoryblokComponent[]';
    case 'datetime':
      return 'string';
    default:
      return 'unknown';
  }
}

/**
 * Generates a TypeScript interface for a Storyblok component
 */
export function generateInterface(component: ComponentSchema): string {
  const interfaceName = toPascalCase(component.name) + 'Blok';

  const fields = Object.entries(component.schema).map(([key, field]) => {
    const fieldName = cleanFieldName(key);
    const tsType = mapFieldType(field);
    const optional = !field.required ? '?' : '';

    // Add JSDoc comment if display_name exists
    const comment = field.display_name
      ? `  /**\n   * ${field.display_name}\n   */\n`
      : '';

    return `${comment}  ${fieldName}${optional}: ${tsType};`;
  }).join('\n\n');

  return `export interface ${interfaceName} {
  _uid: string;
  component: '${component.name}';
  _editable?: string;

${fields}
}`;
}