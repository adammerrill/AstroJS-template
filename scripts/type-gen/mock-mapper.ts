import { toPascalCase, cleanFieldName } from "./utils";
import type { ComponentSchema, SchemaField } from "./types";

/**
 * Maps Storyblok field types to Faker.js data generation strings.
 */
function mapMockValue(field: SchemaField, fieldName: string): string {
  const lowerName = fieldName.toLowerCase();

  if (
    field.type === "text" ||
    field.type === "textarea" ||
    field.type === "markdown"
  ) {
    if (lowerName.includes("name") || lowerName.includes("title"))
      return "faker.person.fullName()";
    if (lowerName.includes("email")) return "faker.internet.email()";
    if (lowerName.includes("color")) return "faker.color.human()";
    if (lowerName.includes("date")) return "faker.date.recent().toISOString()";
    if (lowerName.includes("phone")) return "faker.phone.number()";
    if (lowerName.includes("headline")) return "faker.company.catchPhrase()";
    if (lowerName.includes("price"))
      return 'faker.commerce.price({ symbol: "$" })';
    return "faker.lorem.sentence()";
  }

  switch (field.type) {
    case "number":
      return "faker.number.int({ min: 1, max: 100 }).toString()";
    case "boolean":
      return "faker.datatype.boolean()";
    case "asset":
      return `{ filename: faker.image.url(), alt: faker.lorem.words(3), id: faker.number.int(), copyright: '', fieldtype: 'asset' }`;
    case "multilink":
      return `{ url: faker.internet.url(), cached_url: faker.internet.domainWord(), linktype: 'url', id: '', target: '_self' }`;
    case "richtext":
      return `{ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: faker.lorem.paragraph() }] }] }`;
    case "bloks":
      return "[]";
    case "datetime":
      return "faker.date.recent().toISOString()";
    default:
      return "null";
  }
}

export function generateMockFactory(component: ComponentSchema): string {
  const interfaceName = toPascalCase(component.name) + "Blok";

  const fields = Object.entries(component.schema)
    .map(([key, field]) => {
      const fieldName = cleanFieldName(key);
      const mockVal = mapMockValue(field, key);
      return `      ${fieldName}: ${mockVal},`;
    })
    .join("\n");

  return `
  ${component.name}: (overrides?: Partial<Types.${interfaceName}>): Types.${interfaceName} => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: '${component.name}' as const,
      _editable: '<!--#storyblok#-->',
${fields}
    };
    return { ...defaults, ...overrides } as Types.${interfaceName};
  },`;
}
