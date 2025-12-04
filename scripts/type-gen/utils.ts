/**
 * Converts a snake_case or kebab-case string to PascalCase.
 * Example: "hero_section" -> "HeroSection"
 */
export function toPascalCase(str: string): string {
  // 1. Replace non-alphanumeric chars with spaces
  // 2. Split by space
  // 3. Capitalize first letter of each word
  // 4. Join
  return str
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Clean field names that might be reserved keywords or invalid JS identifiers.
 * (Basic implementation, can be expanded)
 */
export function cleanFieldName(name: string): string {
  if (name.includes("-")) {
    return `'${name}'`; // Quote keys with dashes
  }
  return name;
}
