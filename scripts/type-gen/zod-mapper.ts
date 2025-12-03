import { toPascalCase, cleanFieldName } from './utils';

interface SchemaField {
  type: string;
  required?: boolean;
  description?: string;
  display_name?: string;
  component_whitelist?: string[];
  [key: string]: any;
}

interface ComponentSchema {
  name: string;
  schema: Record<string, SchemaField>;
}

function mapZodType(field: SchemaField): string {
  let zodType = 'z.any()';

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'markdown':
      zodType = 'z.string()';
      break;
    case 'number':
      zodType = 'z.union([z.number(), z.string()]).transform((val) => Number(val))';
      break;
    case 'boolean':
      zodType = 'z.union([z.boolean(), z.string().transform((v) => v === "true" || v === "1")])';
      break;
    case 'asset':
      zodType = 'z.object({ filename: z.string(), alt: z.string().optional(), id: z.number().optional() })';
      break;
    case 'multilink':
      zodType = 'z.object({ cached_url: z.string().optional(), url: z.string().optional(), linktype: z.string().optional() })';
      break;
    case 'richtext':
      zodType = 'z.record(z.any())'; 
      break;
    case 'bloks':
      // Use z.lazy to handle circular references safely
      zodType = 'z.array(z.lazy(() => StoryblokComponentSchema))';
      break;
    case 'datetime':
      zodType = 'z.string()';
      break;
  }

  if (!field.required) {
    zodType = `${zodType}.optional()`;
  }

  return zodType;
}

export function generateZodSchema(component: ComponentSchema): string {
  const schemaName = toPascalCase(component.name) + 'BlokSchema';
  
  const fields = Object.entries(component.schema).map(([key, field]) => {
    const fieldName = cleanFieldName(key);
    const zodDef = mapZodType(field);
    return `  ${fieldName}: ${zodDef},`;
  }).join('\n');

  // Explicitly annotate as z.ZodType<any> to break circular inference loops
  return `
export const ${schemaName}: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal('${component.name}'),
  _editable: z.string().optional(),
${fields}
});`;
}
