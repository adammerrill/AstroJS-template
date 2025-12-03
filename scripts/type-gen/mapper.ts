import { toPascalCase, cleanFieldName } from './utils';

interface SchemaField {
  type: string;
  required?: boolean;
  description?: string;
  display_name?: string;
  component_whitelist?: string[]; // Added property
  [key: string]: any; 
}

interface ComponentSchema {
  name: string;
  schema: Record<string, SchemaField>;
}

/**
 * Maps Storyblok field types to TypeScript definitions.
 */
function mapType(field: SchemaField): string {
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'markdown':
      return 'string';
    
    case 'richtext':
      return 'StoryblokRichText'; 
      
    case 'number':
      return 'string'; 
      
    case 'boolean':
      return 'boolean';
      
    case 'asset':
      return 'StoryblokAsset'; 
      
    case 'multilink':
      return 'StoryblokLink'; 
      
    case 'datetime':
      return 'string';
      
    case 'bloks':
      if (field.component_whitelist && field.component_whitelist.length > 0) {
        // Map whitelist strings to PascalCase Interface names
        const union = field.component_whitelist
          .map((name: string) => toPascalCase(name) + 'Blok')
          .join(' | ');
        return `(${union})[]`;
      }
      return 'any[]'; // Fallback if no whitelist is defined
      
    default:
      return 'any';
  }
}

/**
 * Generates a JSDoc comment block for a field.
 */
function generateJSDoc(field: SchemaField): string {
  const lines: string[] = [];
  if (field.display_name) lines.push(field.display_name);
  if (field.description) lines.push(field.description);
  
  if (lines.length === 0) return '';
  
  return `
  /**
   * ${lines.join(' - ')}
   */`;
}

/**
 * Converts a Component JSON to a TypeScript Interface string.
 */
export function generateInterface(component: ComponentSchema): string {
  const interfaceName = toPascalCase(component.name) + 'Blok';
  
  const fields = Object.entries(component.schema).map(([key, field]) => {
    const fieldName = cleanFieldName(key);
    const typeDef = mapType(field);
    const requiredMarker = field.required ? '' : '?';
    const jsDoc = generateJSDoc(field);
    
    return `${jsDoc}
  ${fieldName}${requiredMarker}: ${typeDef};`;
  }).join('\n');

  return `export interface ${interfaceName} {
  _uid: string;
  component: '${component.name}';
  _editable?: string;
${fields}
}`;
}
