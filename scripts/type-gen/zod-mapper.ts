import { toPascalCase, cleanFieldName } from "./utils";
import type { ComponentSchema, SchemaField } from "./types";

/**
 * Maps Storyblok field types to Zod validation schemas
 *
 * @param field - The schema field to map
 * @returns Zod schema definition string
 */
function mapZodType(field: SchemaField): string {
  let zodType = "z.unknown()";

  switch (field.type) {
    case "text":
    case "textarea":
    case "markdown":
      zodType = "z.string()";
      break;
    case "number":
      zodType =
        "z.union([z.number(), z.string()]).transform((val) => Number(val))";
      break;
    case "boolean":
      zodType =
        'z.union([z.boolean(), z.string().transform((v) => v === "true" || v === "1")])';
      break;
    case "asset":
      zodType =
        "z.object({ filename: z.string(), alt: z.string().optional(), id: z.number().optional() })";
      break;
    case "multilink":
      // CRITICAL FIX: Match the StoryblokLink type definition exactly
      // linktype must be a literal union, not just string
      zodType =
        'z.object({ cached_url: z.string().optional(), url: z.string().optional(), linktype: z.enum(["url", "story", "email", "asset"]).optional() })';
      break;
    case "richtext":
      zodType = "z.record(z.unknown())";
      break;
    case "bloks":
      // CRITICAL: Handle restricted component types like TypeScript mapper does
      if (field.component_whitelist) {
        let whitelist: string[];

        // Support both string (comma-separated) and array formats
        if (Array.isArray(field.component_whitelist)) {
          whitelist = field.component_whitelist;
        } else {
          // Split comma-separated string and clean whitespace
          whitelist = field.component_whitelist
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name.length > 0);
        }

        if (whitelist.length > 0) {
          // Map component names to their schema variables
          const schemaNames = whitelist.map(
            (name: string) => `${toPascalCase(name)}BlokSchema`,
          );

          // Generate specific union for restricted bloks fields
          if (schemaNames.length === 1) {
            zodType = `z.array(z.lazy(() => ${schemaNames[0]}))`;
          } else {
            zodType = `z.array(z.lazy(() => z.union([${schemaNames.join(", ")}])))`;
          }
          break;
        }
      }

      // Fallback to generic component schema for unrestricted bloks
      zodType = "z.array(z.lazy(() => StoryblokComponentSchema))";
      break;
    case "datetime":
      zodType = "z.string()";
      break;
  }

  if (!field.required) {
    zodType = `${zodType}.optional()`;
  }

  return zodType;
}

/**
 * Generates a Zod validation schema for a Storyblok component
 *
 * @param component - The component schema to generate validation for
 * @returns Zod schema definition as a string
 */
export function generateZodSchema(component: ComponentSchema): string {
  const schemaName = toPascalCase(component.name) + "BlokSchema";
  const typeName = toPascalCase(component.name) + "Blok";

  const fields = Object.entries(component.schema)
    .map(([key, field]) => {
      const fieldName = cleanFieldName(key);
      const zodDef = mapZodType(field);
      return `  ${fieldName}: ${zodDef},`;
    })
    .join("\n");

  // Check if this schema uses z.lazy (has circular references)
  const hasCircularRef = Object.values(component.schema).some(
    (field) => field.type === "bloks",
  );

  if (hasCircularRef) {
    // For schemas with circular references, provide explicit type annotation
    // This is required per Zod documentation for recursive schemas
    return `export const ${schemaName}: z.ZodType<${typeName}> = z.object({
  _uid: z.string(),
  component: z.literal('${component.name}'),
  _editable: z.string().optional(),
${fields}
});`;
  } else {
    // For simple schemas without circular references, no type annotation needed
    return `export const ${schemaName} = z.object({
  _uid: z.string(),
  component: z.literal('${component.name}'),
  _editable: z.string().optional(),
${fields}
});`;
  }
}
