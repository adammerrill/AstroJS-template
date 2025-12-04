/**
 * @fileoverview Shared type definitions for Storyblok component schema processing
 *
 * @module type-gen/types
 * @version 1.1.0
 * @author Atom Merrill
 * @license MIT
 *
 * @description
 * This module provides centralized type definitions used across the type generation
 * pipeline. By maintaining a single source of truth for these types, we ensure
 * consistency between the schema fetching, type generation, Zod schema generation,
 * and mock factory generation processes.
 *
 * These types match the structure returned by the Storyblok Management API and
 * are used throughout the type generation scripts to ensure type safety.
 *
 * @see {@link https://www.storyblok.com/docs/api/management/components/the-component-object}
 * @see {@link https://www.storyblok.com/docs/api/management/components/the-component-schema-field-object}
 *
 * @changelog
 * - v1.1.0: Fixed component_whitelist type - it's a comma-separated string, not an array
 * - v1.0.0: Initial implementation with comprehensive field definitions
 */

/**
 * Represents a single field/property within a Storyblok component schema.
 * This is also referred to as SchemaField in some parts of the codebase.
 *
 * @interface SchemaField
 * @property {string} type - The field type identifier (e.g., 'text', 'textarea', 'bloks', 'asset', 'richtext')
 * @property {number} [pos] - Position/order of the field in the component editor
 * @property {boolean} [translatable] - Whether the field supports multi-language content
 * @property {boolean} [required] - Whether the field is mandatory for content editors
 * @property {string} [display_name] - Human-readable label shown in the Storyblok editor
 * @property {string} [description] - Help text or description for content editors
 * @property {string} [default_value] - Default value when creating new content
 * @property {string} [component_whitelist] - **IMPORTANT**: Comma-separated string of allowed nested component types (e.g., "button,image,text_block"), NOT an array
 * @property {string} [restrict_type] - Restriction on allowed component types
 * @property {string} [restrict_components] - Whether to restrict which components can be used
 * @property {string} [component_group_whitelist] - UUID of allowed component groups
 * @property {string} [maximum] - Maximum number of items (for multi-value fields)
 * @property {string} [minimum] - Minimum number of items (for multi-value fields)
 * @property {string} [regex] - Regular expression pattern for validation
 * @property {string} [asset_folder_id] - Specific asset folder for file uploads
 * @property {string[]} [filetypes] - Allowed file types (for asset fields): ["images", "videos", "audios", "texts"]
 * @property {string} [source] - Data source for options fields (e.g., 'internal_stories', 'internal_languages')
 * @property {string} [datasource_slug] - Slug of the datasource to use
 * @property {string} [folder_slug] - Path filter for story selection
 * @property {string[]} [filter_content_type] - Array of content types to filter by
 * @property {string} [display_type] - Display style for reference fields ('link' or 'card')
 * @property {boolean} [allow_target_blank] - Allow opening links in new tab
 * @property {boolean} [force_link_scope] - Force links to stay within current language
 * @property {string} [toolbar] - Richtext editor toolbar configuration (JSON array)
 * @property {string} [rtl] - Right-to-left text direction support
 * @property {Array<{name: string; value: string}>} [options] - Predefined options for select/multi-select fields
 *
 * @remarks
 * This interface uses string index signature to allow for additional properties
 * that may be added by Storyblok in the future or custom field type plugins.
 * The Storyblok API returns field definitions with various optional properties
 * depending on the field type.
 *
 * **CRITICAL NOTE ON component_whitelist**:
 * The Storyblok Management API returns component_whitelist as a comma-separated
 * string, not an array. If you need to work with it as an array in your code,
 * you must split it first: `field.component_whitelist?.split(',')` or use an
 * empty array fallback.
 *
 * @example
 * // Text field example
 * const textField: SchemaField = {
 *   type: "text",
 *   pos: 0,
 *   translatable: true,
 *   required: true,
 *   display_name: "Headline",
 *   description: "Main heading for the hero section"
 * };
 *
 * @example
 * // Bloks field (nested components) example with whitelist
 * const bloksField: SchemaField = {
 *   type: "bloks",
 *   pos: 1,
 *   restrict_components: "true",
 *   component_whitelist: "button,image,text_block" // ← String, not array!
 * };
 *
 * // To use as array, split it:
 * const allowedComponents = bloksField.component_whitelist?.split(',') || [];
 *
 * @see {@link https://www.storyblok.com/docs/api/management/components/the-component-schema-field-object}
 */
export interface SchemaField {
    type: string;
    pos?: number;
    translatable?: boolean;
    required?: boolean;
    display_name?: string;
    description?: string;
    default_value?: string;
    component_whitelist?: string | string[]; // ← Comma-separated string, NOT an array!
    restrict_type?: string;
    restrict_components?: string;
    component_group_whitelist?: string;
    maximum?: string;
    minimum?: string;
    regex?: string;
    asset_folder_id?: string;
    filetypes?: string[];
    source?: string;
    datasource_slug?: string;
    folder_slug?: string;
    filter_content_type?: string[];
    display_type?: string;
    allow_target_blank?: boolean;
    force_link_scope?: boolean;
    toolbar?: string;
    rtl?: string;
    options?: Array<{ name: string; value: string }>;
    // Allow additional properties for extensibility
    [key: string]: unknown;
  }
  
  /**
   * Represents a complete Storyblok component schema as returned by the Management API.
   *
   * @interface ComponentSchema
   * @property {string} name - The unique component identifier (e.g., 'hero', 'button', 'call_to_action')
   * @property {string} [display_name] - Human-readable component name shown in the Storyblok UI
   * @property {Record<string, SchemaField>} schema - Dictionary of field definitions keyed by field name
   * @property {string} [image] - URL to preview image shown in the component library
   * @property {string} [preview_field] - Field name to use for generating component preview text
   * @property {boolean} [is_root] - Whether this component can be used as a root/top-level component
   * @property {boolean} [is_nestable] - Whether this component can be nested within other components
   * @property {string | null} [preview_tmpl] - Custom preview template
   * @property {Array<unknown>} [all_presets] - Array of preset configurations for this component
   * @property {number | null} [preset_id] - ID of the active preset
   * @property {string} [real_name] - Internal component name (usually matches 'name')
   * @property {string} [component_group_uuid] - UUID of the component group this belongs to
   * @property {string} [color] - Hex color code for component identification in UI
   * @property {string} [icon] - Icon identifier for component representation
   * @property {Array<{id: number; name: string}>} [internal_tags_list] - Array of internal tag objects
   * @property {string[]} [internal_tag_ids] - Array of internal tag ID strings
   * @property {string | null} [content_type_asset_preview] - Field to use for asset preview in content type
   * @property {number} [id] - Numeric component ID
   * @property {string} [created_at] - ISO 8601 timestamp of creation
   * @property {string} [updated_at] - ISO 8601 timestamp of last update
   *
   * @remarks
   * This interface matches the component object structure returned by the
   * Storyblok Management API GET /spaces/{space_id}/components endpoint.
   * The schema property is the most important field, containing the field definitions.
   *
   * @example
   * const heroComponent: ComponentSchema = {
   *   name: "hero",
   *   display_name: "Hero Section",
   *   is_root: true,
   *   is_nestable: false,
   *   schema: {
   *     headline: {
   *       type: "text",
   *       required: true,
   *       translatable: true
   *     },
   *     image: {
   *       type: "asset",
   *       filetypes: ["images"]
   *     },
   *     cta_buttons: {
   *       type: "bloks",
   *       component_whitelist: "button,link_button" // ← String, not array
   *     }
   *   }
   * };
   *
   * @see {@link https://www.storyblok.com/docs/api/management/core-resources/components/the-component-object}
   */
  export interface ComponentSchema {
    name: string;
    display_name?: string;
    schema: Record<string, SchemaField>;
    image?: string;
    preview_field?: string;
    is_root?: boolean;
    is_nestable?: boolean;
    preview_tmpl?: string | null;
    all_presets?: Array<unknown>;
    preset_id?: number | null;
    real_name?: string;
    component_group_uuid?: string;
    color?: string;
    icon?: string;
    internal_tags_list?: Array<{ id: number; name: string }>;
    internal_tag_ids?: string[];
    content_type_asset_preview?: string | null;
    id?: number;
    created_at?: string;
    updated_at?: string;
    // Allow additional properties for future API additions
    [key: string]: unknown;
  }
  
  /**
   * Type alias for consistency across the codebase.
   * Some parts of the code refer to this as ComponentField.
   *
   * @remarks
   * Use SchemaField instead for consistency. This alias is provided for
   * backwards compatibility only.
   */
  export type ComponentField = SchemaField;
  