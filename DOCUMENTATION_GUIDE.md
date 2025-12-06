# Comprehensive Documentation Standards Guide

**Version:** 2.0.0  
**Last Updated:** 2024-12-04  
**Status:** Active  
**Scope:** Enterprise-grade documentation for Astro 5 + Svelte 5 + Tailwind 4 applications

---

## Table of Contents

1. [Overview](#overview)
2. [Documentation Philosophy](#documentation-philosophy)
3. [General Principles](#general-principles)
4. [JSDoc Complete Reference](#jsdoc-complete-reference)
5. [TypeScript Documentation](#typescript-documentation)
6. [Astro Component Documentation](#astro-component-documentation)
7. [Svelte 5 Component Documentation](#svelte-5-component-documentation)
8. [JavaScript Documentation](#javascript-documentation)
9. [CSS & Tailwind Documentation](#css--tailwind-documentation)
10. [Configuration Files](#configuration-files)
11. [Markdown Documentation](#markdown-documentation)
12. [YAML Documentation](#yaml-documentation)
13. [Comment Patterns & Best Practices](#comment-patterns--best-practices)
14. [String & Text Formatting](#string--text-formatting)
15. [Edge Cases & Special Scenarios](#edge-cases--special-scenarios)
16. [Testing Documentation](#testing-documentation)
17. [API Documentation](#api-documentation)
18. [Error Handling Documentation](#error-handling-documentation)
19. [Performance Documentation](#performance-documentation)
20. [Security Documentation](#security-documentation)
21. [Accessibility Documentation](#accessibility-documentation)
22. [Migration & Deprecation](#migration--deprecation)
23. [Examples Library](#examples-library)
24. [Quick Reference Tables](#quick-reference-tables)
25. [Documentation Workflow](#documentation-workflow)

---

## Overview

This guide establishes comprehensive documentation standards for our technology stack:

- **Framework:** Astro 5 (SSG/SSR hybrid)
- **UI Library:** Svelte 5 with runes
- **Styling:** Tailwind 4 CSS
- **Language:** TypeScript 5.x
- **Runtime:** Node.js 20.x
- **Package Manager:** pnpm 8.x
- **Testing:** Vitest, Playwright
- **Linting:** ESLint 9.x

### Document Purpose

1. Establish consistent documentation patterns across all file types
2. Define when and how to document code
3. Provide comprehensive examples for every scenario
4. Create a single source of truth for documentation standards
5. Enable efficient onboarding and knowledge transfer

---

## Documentation Philosophy

### Core Principles

**1. Documentation as Code**
- Documentation lives with code
- Updated in the same commit as code changes
- Reviewed in pull requests
- Version controlled

**2. Audience-First Approach**
- Write for the reader, not yourself in 6 months
- Assume intelligence but not familiarity
- Explain "why" before "how"
- Provide context and rationale

**3. Progressive Disclosure**
- Start with high-level overview
- Provide details on demand
- Link to deeper documentation
- Use examples liberally

**4. Maintenance Culture**
- Outdated docs are worse than no docs
- Flag deprecated patterns immediately
- Remove obsolete documentation
- Regular documentation audits

**5. Accessibility Matters**
- Clear, simple language
- Consistent terminology
- Proper semantic structure
- Screen reader friendly

---

## General Principles

### The Documentation Hierarchy

```
Level 1: README.md - Project overview, quick start
Level 2: Architecture docs - System design, patterns
Level 3: API documentation - Public interfaces
Level 4: Component docs - Component usage
Level 5: Function docs - Implementation details
Level 6: Inline comments - Complex logic explanation
```

### When to Document

#### ALWAYS Document

✅ **Public APIs and Exports**
```typescript
// Every exported function, class, type, interface
export function publicAPI() {} // REQUIRES DOCS
```

✅ **Complex Algorithms**
```typescript
// O(n²) or higher complexity
// Non-obvious optimization techniques
// Mathematical formulas
```

✅ **Business Logic**
```typescript
// Domain-specific calculations
// Compliance requirements
// Industry-specific rules
```

✅ **Component Props**
```typescript
// All component properties
// Expected types and constraints
// Default values and behavior
```

✅ **Configuration Options**
```typescript
// Environment variables
// Config file schemas
// Feature flags
```

✅ **Breaking Changes**
```typescript
// API changes that break existing code
// Migration paths
// Deprecation timelines
```

✅ **Security Considerations**
```typescript
// Authentication/authorization logic
// Input validation
// Data sanitization
```

✅ **Performance Critical Code**
```typescript
// Optimization techniques
// Resource-intensive operations
// Caching strategies
```

#### CONSIDER Documenting

⚠️ **Helper Functions**
```typescript
// If used across multiple modules
// If name isn't self-explanatory
```

⚠️ **Type Definitions**
```typescript
// Complex union types
// Discriminated unions
// Generic type constraints
```

⚠️ **Event Handlers**
```typescript
// If they have side effects
// If they modify global state
```

⚠️ **State Management**
```typescript
// State shape and purpose
// State transitions
// Side effects
```

#### SKIP Documentation

❌ **Self-Explanatory Code**
```typescript
// Bad: Over-documenting obvious code
/**
 * Gets the user name
 * @returns user name
 */
function getUserName() { return user.name; } // Don't document this

// Good: Let code speak
function getUserName() { return user.name; }
```

❌ **Trivial Getters/Setters**
```typescript
get value() { return this._value; } // No docs needed
set value(v) { this._value = v; }   // No docs needed
```

❌ **Generated Files**
```typescript
// Auto-generated types
// Build artifacts
// Compiled outputs
```

❌ **Test Data**
```typescript
const mockUser = { id: 1, name: 'Test' }; // No docs needed
```

### Documentation Quality Standards

#### Good Documentation Characteristics

1. **Accurate** - Matches current implementation
2. **Complete** - Covers all parameters and return values
3. **Clear** - Easy to understand
4. **Concise** - No unnecessary verbosity
5. **Contextual** - Explains why, not just what
6. **Current** - Updated with code changes
7. **Consistent** - Follows established patterns

#### Documentation Red Flags

🚩 **Vague descriptions** - "Handles user data"  
🚩 **Outdated examples** - Examples that don't work  
🚩 **Missing edge cases** - No mention of error conditions  
🚩 **Copy-paste docs** - Same description for different functions  
🚩 **Implementation details** - Too much low-level detail  
🚩 **No examples** - Complex APIs without usage examples  
🚩 **Broken links** - References to non-existent docs  

---

## JSDoc Complete Reference

### JSDoc Block Structure

```typescript
/**
 * Brief one-line description (required).
 *
 * Extended description with more context. Can span multiple
 * paragraphs and include detailed explanations.
 *
 * Additional details about behavior, edge cases, or important
 * information that users need to know.
 *
 * @tag Description of tag
 * @tag Multiple tags organized logically
 *
 * @example
 * ```typescript
 * // Example code
 * ```
 *
 * @see Related information
 * @since Version information
 */
```

### Complete JSDoc Tag Reference

#### Core Tags

**@param** - Function parameter documentation
```typescript
/**
 * @param paramName - Description
 * @param {Type} paramName - Description with type (JS)
 * @param paramName - Multi-line description
 *   can continue on next line with proper indentation
 * @param options - Configuration object
 * @param options.nested - Nested property
 * @param options.deep.nested - Deeply nested property
 * @param [optional] - Optional parameter (JS)
 * @param {Type} [optional=default] - Optional with default (JS)
 * @param {...Type} rest - Rest parameters
 */
```

**@returns / @return** - Return value documentation
```typescript
/**
 * @returns Description of return value
 * @returns {Type} Description with type (JS)
 * @returns {Promise<Type>} Async return type
 * @returns {Type | null} Union return type
 * @returns {void} No return value
 */
```

**@throws / @exception** - Error documentation
```typescript
/**
 * @throws {ErrorType} Condition when error is thrown
 * @throws {ValidationError} When input is invalid
 * @throws {NetworkError} On connection failure
 * @throws Will throw if parameter is negative
 */
```

**@example** - Usage examples
```typescript
/**
 * @example
 * ```typescript
 * // Simple example
 * const result = myFunction('input');
 * ```
 *
 * @example
 * // Multiple examples for different scenarios
 * ```typescript
 * // Advanced usage
 * const result = myFunction('input', { option: true });
 * ```
 *
 * @example
 * Caption for example
 * ```typescript
 * // Example with caption
 * ```
 */
```

#### Type Documentation Tags

**@type** - Variable type annotation
```typescript
/**
 * @type {string}
 */
let username;

/**
 * @type {Array<User>}
 */
let users;

/**
 * @type {{ id: string, name: string }}
 */
let userObject;
```

**@typedef** - Custom type definition
```typescript
/**
 * User object structure.
 *
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} name - User's name
 * @property {number} [age] - User's age (optional)
 * @property {Array<string>} roles - User roles
 */
```

**@template** - Generic type parameters
```typescript
/**
 * Generic container.
 *
 * @template T - The type of items
 * @template K - Key type
 * @template {string} S - Constrained to string
 * @template {User | Admin} U - Union constraint
 */
class Container<T> {}
```

**@implements** - Interface implementation
```typescript
/**
 * @implements {Serializable}
 * @implements {Comparable<User>}
 */
class User {}
```

**@extends** - Class inheritance
```typescript
/**
 * @extends {BaseClass}
 * @extends {EventEmitter<CustomEvents>}
 */
class DerivedClass extends BaseClass {}
```

#### Classification Tags

**@public** - Public API
```typescript
/**
 * @public
 */
export function publicAPI() {}
```

**@private** - Private implementation
```typescript
/**
 * @private
 */
function internalHelper() {}
```

**@protected** - Protected member
```typescript
/**
 * @protected
 */
protected method() {}
```

**@internal** - Internal use only
```typescript
/**
 * @internal
 * Not part of public API - may change without notice
 */
export function _internalHelper() {}
```

**@package** - Package-private
```typescript
/**
 * @package
 * Only for use within this package
 */
```

#### Status Tags

**@deprecated** - Deprecated API
```typescript
/**
 * @deprecated Since v2.0.0 - Use newFunction() instead
 * @see {@link newFunction}
 */
function oldFunction() {}
```

**@experimental** - Experimental feature
```typescript
/**
 * @experimental
 * This API is unstable and may change in future versions
 */
```

**@beta** - Beta feature
```typescript
/**
 * @beta
 * This feature is in beta and may have bugs
 */
```

**@alpha** - Alpha feature
```typescript
/**
 * @alpha
 * Early preview - expect breaking changes
 */
```

#### Versioning Tags

**@since** - Version added
```typescript
/**
 * @since 1.2.0
 * @since 1.2.0 Added support for async operations
 */
```

**@version** - Current version
```typescript
/**
 * @version 2.1.0
 */
```

#### Relationship Tags

**@see** - Related documentation
```typescript
/**
 * @see {@link RelatedFunction} for similar functionality
 * @see {@link https://example.com/docs} for more information
 * @see RelatedClass
 * @see module:utils/helpers
 */
```

**@link** - Inline link
```typescript
/**
 * Uses {@link helperFunction} internally.
 * See {@linkcode complexAlgorithm} for implementation.
 * Visit {@linkplain https://example.com} for docs.
 */
```

**@tutorial** - Tutorial reference
```typescript
/**
 * @tutorial getting-started
 * @tutorial advanced-usage
 */
```

#### Module/File Tags

**@module** - Module identifier
```typescript
/**
 * @module utils/string
 * @module utils/string - String utility functions
 */
```

**@namespace** - Namespace definition
```typescript
/**
 * @namespace Utils
 */
```

**@memberof** - Member ownership
```typescript
/**
 * @memberof Utils
 * @memberof! Utils (forces membership)
 */
```

#### Functional Tags

**@async** - Async function marker
```typescript
/**
 * @async
 */
async function fetchData() {}
```

**@generator** - Generator function
```typescript
/**
 * @generator
 * @yields {number} Sequential numbers
 */
function* numberGenerator() {}
```

**@yields** - Generator yield values
```typescript
/**
 * @yields {User} User object from database
 */
```

**@callback** - Callback type definition
```typescript
/**
 * @callback RequestCallback
 * @param {Error} error - Error object
 * @param {Response} response - Response object
 * @returns {void}
 */
```

**@fires / @emits** - Event emission
```typescript
/**
 * @fires CustomEvent#change
 * @emits update when data changes
 */
```

**@listens** - Event listening
```typescript
/**
 * @listens CustomEvent#change
 */
```

#### Documentation Organization

**@description** - Explicit description
```typescript
/**
 * @description
 * Detailed description when needed separately
 * from the summary line
 */
```

**@summary** - Brief summary
```typescript
/**
 * @summary Brief one-line summary
 */
```

**@classdesc** - Class description
```typescript
/**
 * @class
 * @classdesc Detailed class description
 */
```

**@file / @file** - File-level docs
```typescript
/**
 * @file Brief file description
 * @file Detailed file documentation
 * @author Team Name
 * @version 1.0.0
 */
```

**@author** - Author information
```typescript
/**
 * @author John Doe <john@example.com>
 * @author Team Name
 */
```

**@copyright** - Copyright notice
```typescript
/**
 * @copyright Company Name 2024
 */
```

**@license** - License information
```typescript
/**
 * @license MIT
 * @license Apache-2.0
 */
```

#### Property Tags

**@property / @prop** - Object properties
```typescript
/**
 * @property {string} name - Property description
 * @prop {number} age - Alternative syntax
 */
```

**@readonly** - Read-only property
```typescript
/**
 * @readonly
 */
```

**@constant / @const** - Constant value
```typescript
/**
 * @constant
 * @type {number}
 * @default 42
 */
const MAX_SIZE = 42;
```

**@default / @defaultvalue** - Default value
```typescript
/**
 * @param {number} [timeout=5000] - Timeout in ms
 * @default 5000
 */
```

**@enum** - Enumeration
```typescript
/**
 * @enum {string}
 */
const Status = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};
```

#### Advanced Tags

**@override** - Method override
```typescript
/**
 * @override
 */
```

**@abstract** - Abstract member
```typescript
/**
 * @abstract
 */
```

**@virtual** - Virtual method
```typescript
/**
 * @virtual
 */
```

**@mixin** - Mixin definition
```typescript
/**
 * @mixin
 */
```

**@augments** - Augmentation
```typescript
/**
 * @augments BaseClass
 */
```

**@borrows** - Borrowed member
```typescript
/**
 * @borrows OtherClass#method as myMethod
 */
```

**@requires** - Dependencies
```typescript
/**
 * @requires module:fs
 * @requires module:path
 */
```

**@external / @host** - External types
```typescript
/**
 * @external Promise
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}
 */
```

**@todo** - TODO items
```typescript
/**
 * @todo Implement caching mechanism
 * @todo Add input validation
 */
```

**@ignore** - Ignore in documentation
```typescript
/**
 * @ignore
 */
```

**@access** - Access level
```typescript
/**
 * @access private
 * @access protected
 * @access public
 */
```

---

## TypeScript Documentation

### File Header Documentation

```typescript
/**
 * @file Authentication and authorization utilities
 * 
 * This module provides comprehensive authentication mechanisms including:
 * - JWT token generation and validation
 * - Password hashing and verification
 * - Session management
 * - Role-based access control
 *
 * @module auth/core
 * @author Authentication Team <auth@example.com>
 * @version 2.1.0
 * @since 1.0.0
 * @license MIT
 * 
 * @requires bcrypt
 * @requires jsonwebtoken
 * 
 * @see {@link https://docs.example.com/auth} for detailed authentication docs
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
```

### Function Documentation - Complete Examples

#### Simple Function

```typescript
/**
 * Capitalizes the first letter of a string.
 *
 * @param text - The string to capitalize
 * @returns The capitalized string
 *
 * @example
 * ```typescript
 * capitalize('hello'); // Returns: 'Hello'
 * capitalize('WORLD'); // Returns: 'WORLD'
 * capitalize('');      // Returns: ''
 * ```
 *
 * @since 1.0.0
 */
export function capitalize(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
```

#### Function with Options Object

```typescript
/**
 * Formats a date according to specified options.
 *
 * Supports multiple input formats and provides flexible output formatting.
 * Uses Intl.DateTimeFormat for locale-aware formatting.
 *
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param options - Formatting configuration
 * @param options.locale - Locale for formatting
 * @param options.timezone - IANA timezone identifier
 * @param options.dateStyle - Predefined date format style
 * @param options.timeStyle - Predefined time format style
 * @param options.format - Custom format string (overrides styles)
 * @returns Formatted date string
 *
 * @throws {TypeError} If date is invalid or unparseable
 * @throws {RangeError} If timezone is not recognized
 *
 * @example
 * Basic usage
 * ```typescript
 * const date = new Date('2024-12-04T10:30:00Z');
 * 
 * formatDate(date);
 * // Returns: "12/4/2024"
 * 
 * formatDate(date, { locale: 'en-US', dateStyle: 'long' });
 * // Returns: "December 4, 2024"
 * 
 * formatDate(date, { timeStyle: 'short' });
 * // Returns: "10:30 AM"
 * ```
 *
 * @example
 * Advanced usage with timezone
 * ```typescript
 * formatDate(date, {
 *   locale: 'de-DE',
 *   timezone: 'Europe/Berlin',
 *   dateStyle: 'full',
 *   timeStyle: 'long'
 * });
 * // Returns: "Mittwoch, 4. Dezember 2024 um 11:30:00 MEZ"
 * ```
 *
 * @example
 * Handling different input types
 * ```typescript
 * // Date object
 * formatDate(new Date());
 * 
 * // ISO string
 * formatDate('2024-12-04T10:30:00Z');
 * 
 * // Unix timestamp
 * formatDate(1701691800000);
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat}
 * @since 1.2.0
 */
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const {
    locale = 'en-US',
    timezone = 'UTC',
    dateStyle = 'short',
    timeStyle,
    format
  } = options;

  // Normalize input to Date object
  let dateObj: Date;
  
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    throw new TypeError(
      `Invalid date type: expected Date, string, or number, received ${typeof date}`
    );
  }

  // Validate date
  if (isNaN(dateObj.getTime())) {
    throw new TypeError(
      `Invalid date: unable to parse "${date}"`
    );
  }

  // Custom format takes precedence
  if (format) {
    return applyCustomFormat(dateObj, format, locale, timezone);
  }

  // Use Intl.DateTimeFormat
  const formatterOptions: Intl.DateTimeFormatOptions = {
    dateStyle,
    timeStyle,
    timeZone: timezone
  };

  try {
    const formatter = new Intl.DateTimeFormat(locale, formatterOptions);
    return formatter.format(dateObj);
  } catch (error) {
    if (error instanceof RangeError) {
      throw new RangeError(`Invalid timezone: "${timezone}"`);
    }
    throw error;
  }
}

/**
 * Date formatting configuration options.
 *
 * @interface
 * @since 1.2.0
 */
export interface DateFormatOptions {
  /**
   * Locale identifier for formatting.
   * Uses BCP 47 language tags.
   *
   * @default 'en-US'
   * @example 'en-US', 'de-DE', 'ja-JP'
   */
  locale?: string;

  /**
   * IANA timezone identifier.
   *
   * @default 'UTC'
   * @example 'America/New_York', 'Europe/London', 'Asia/Tokyo'
   * @see {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones}
   */
  timezone?: string;

  /**
   * Predefined date format style.
   *
   * @default 'short'
   */
  dateStyle?: 'full' | 'long' | 'medium' | 'short';

  /**
   * Predefined time format style.
   *
   * @optional
   */
  timeStyle?: 'full' | 'long' | 'medium' | 'short';

  /**
   * Custom format string (overrides dateStyle and timeStyle).
   *
   * Format tokens:
   * - YYYY: 4-digit year
   * - MM: 2-digit month
   * - DD: 2-digit day
   * - HH: 2-digit hour (24h)
   * - mm: 2-digit minute
   * - ss: 2-digit second
   *
   * @example 'YYYY-MM-DD HH:mm:ss'
   * @optional
   */
  format?: string;
}
```

#### Async Function with Error Handling

```typescript
/**
 * Fetches user data from the API with retry logic.
 *
 * Implements exponential backoff retry strategy for transient failures.
 * Caches successful responses for 5 minutes to reduce API calls.
 *
 * Retry behavior:
 * - Max 3 retry attempts
 * - Exponential backoff: 1s, 2s, 4s
 * - Only retries on network errors or 5xx responses
 * - Does not retry on 4xx client errors
 *
 * @param userId - Unique user identifier (UUID v4 format)
 * @param options - Fetch configuration options
 * @param options.skipCache - Bypass cache and fetch fresh data
 * @param options.timeout - Request timeout in milliseconds
 * @param options.signal - AbortSignal for request cancellation
 * @returns Promise resolving to user data
 *
 * @throws {ValidationError} If userId format is invalid
 * @throws {NotFoundError} If user does not exist (404)
 * @throws {UnauthorizedError} If authentication is required (401)
 * @throws {ForbiddenError} If access is denied (403)
 * @throws {NetworkError} If all retry attempts fail
 * @throws {TimeoutError} If request exceeds timeout duration
 *
 * @example
 * Basic usage
 * ```typescript
 * try {
 *   const user = await fetchUser('123e4567-e89b-12d3-a456-426614174000');
 *   console.log(user.name);
 * } catch (error) {
 *   if (error instanceof NotFoundError) {
 *     console.error('User not found');
 *   } else if (error instanceof NetworkError) {
 *     console.error('Network issue:', error.message);
 *   }
 * }
 * ```
 *
 * @example
 * With options
 * ```typescript
 * const controller = new AbortController();
 * 
 * // Set timeout to abort request
 * setTimeout(() => controller.abort(), 10000);
 * 
 * const user = await fetchUser('123e4567-e89b-12d3-a456-426614174000', {
 *   skipCache: true,
 *   timeout: 5000,
 *   signal: controller.signal
 * });
 * ```
 *
 * @example
 * Error handling
 * ```typescript
 * try {
 *   const user = await fetchUser(userId);
 * } catch (error) {
 *   switch (true) {
 *     case error instanceof ValidationError:
 *       // Handle invalid input
 *       break;
 *     case error instanceof NotFoundError:
 *       // Handle missing user
 *       break;
 *     case error instanceof UnauthorizedError:
 *       // Redirect to login
 *       break;
 *     case error instanceof NetworkError:
 *       // Show retry button
 *       break;
 *     default:
 *       // Log unexpected error
 *       console.error('Unexpected error:', error);
 *   }
 * }
 * ```
 *
 * @see {@link updateUser} for updating user data
 * @see {@link deleteUser} for deleting users
 * @since 1.0.0
 * @async
 */
export async function fetchUser(
  userId: string,
  options: FetchUserOptions = {}
): Promise<User> {
  const {
    skipCache = false,
    timeout = 30000,
    signal
  } = options;

  // Input validation
  if (!isValidUUID(userId)) {
    throw new ValidationError(
      `Invalid userId format: expected UUID v4, received "${userId}"`
    );
  }

  // Check cache first (unless explicitly skipped)
  if (!skipCache) {
    const cached = cache.get<User>(`user:${userId}`);
    if (cached) {
      return cached;
    }
  }

  // Retry configuration
  const MAX_RETRIES = 3;
  const BASE_DELAY = 1000; // 1 second

  let lastError: Error;

  // Retry loop with exponential backoff
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Combine user-provided signal with timeout signal
      const combinedSignal = signal
        ? combineAbortSignals([signal, controller.signal])
        : controller.signal;

      const response = await fetch(`${API_BASE}/users/${userId}`, {
        signal: combinedSignal,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new NotFoundError(`User not found: ${userId}`);
          case 401:
            throw new UnauthorizedError('Authentication required');
          case 403:
            throw new ForbiddenError('Access denied');
          case 429:
            // Rate limited - retry with backoff
            if (attempt < MAX_RETRIES) {
              await delay(BASE_DELAY * Math.pow(2, attempt));
              continue;
            }
            throw new RateLimitError('Too many requests');
          default:
            if (response.status >= 500) {
              // Server error - retry
              if (attempt < MAX_RETRIES) {
                await delay(BASE_DELAY * Math.pow(2, attempt));
                continue;
              }
              throw new ServerError(`Server error: ${response.status}`);
            }
            throw new APIError(`Request failed: ${response.status}`);
        }
      }

      // Parse response
      const user = await response.json() as User;

      // Validate response shape
      if (!isValidUser(user)) {
        throw new ValidationError('Invalid user data received from API');
      }

      // Cache successful response
      cache.set(`user:${userId}`, user, { ttl: 300000 }); // 5 minutes

      return user;

    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors or validation errors
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError
      ) {
        throw error;
      }

      // Handle abort
      if (error instanceof DOMException && error.name === 'AbortError') {
        if (signal?.aborted) {
          throw new AbortError('Request was cancelled');
        } else {
          throw new TimeoutError(`Request timeout after ${timeout}ms`);
        }
      }

      // Retry on network errors
      if (attempt < MAX_RETRIES) {
        await delay(BASE_DELAY * Math.pow(2, attempt));
        continue;
      }

      // All retries exhausted
      throw new NetworkError(
        `Failed to fetch user after ${MAX_RETRIES} attempts: ${lastError.message}`
      );
    }
  }

  // TypeScript exhaustiveness check
  throw lastError!;
}

/**
 * Options for fetching user data.
 *
 * @interface
 * @since 1.0.0
 */
export interface FetchUserOptions {
  /**
   * Skip cache and fetch fresh data from API.
   *
   * Use when data freshness is critical or after mutations.
   *
   * @default false
   */
  skipCache?: boolean;

  /**
   * Request timeout in milliseconds.
   *
   * Request will be aborted if it takes longer than this value.
   *
   * @default 30000
   * @minimum 1000
   * @maximum 120000
   */
  timeout?: number;

  /**
   * AbortSignal for request cancellation.
   *
   * Allows external cancellation of the request (e.g., component unmount).
   *
   * @optional
   * @example
   * ```typescript
   * const controller = new AbortController();
   * fetchUser(id, { signal: controller.signal });
   * 
   * // Cancel request
   * controller.abort();
   * ```
   */
  signal?: AbortSignal;
}
```

### Class Documentation

```typescript
/**
 * In-memory cache with TTL (time-to-live) support.
 *
 * Provides a simple key-value store with automatic expiration.
 * Uses a Map for O(1) get/set operations and a cleanup interval
 * to remove expired entries.
 *
 * Features:
 * - Generic type support for type-safe values
 * - Configurable TTL per entry or global default
 * - Automatic cleanup of expired entries
 * - Size limits to prevent memory leaks
 * - Event emission for cache operations (optional)
 *
 * Performance characteristics:
 * - Get: O(1)
 * - Set: O(1)
 * - Delete: O(1)
 * - Cleanup: O(n) where n is number of expired entries
 *
 * Memory usage:
 * - Each entry: ~100-200 bytes overhead
 * - Max recommended entries: 10,000
 *
 * @class
 * @template T - Type of cached values
 *
 * @example
 * Basic usage
 * ```typescript
 * const cache = new Cache<User>();
 * 
 * // Store with default TTL
 * cache.set('user:123', user);
 * 
 * // Store with custom TTL (5 minutes)
 * cache.set('user:456', user, { ttl: 300000 });
 * 
 * // Retrieve
 * const user = cache.get('user:123');
 * 
 * // Check existence
 * if (cache.has('user:123')) {
 *   console.log('User is cached');
 * }
 * 
 * // Remove
 * cache.delete('user:123');
 * 
 * // Clear all
 * cache.clear();
 * ```
 *
 * @example
 * With configuration
 * ```typescript
 * const cache = new Cache<string>({
 *   defaultTTL: 60000,      // 1 minute default
 *   maxSize: 1000,          // Max 1000 entries
 *   cleanupInterval: 30000  // Cleanup every 30 seconds
 * });
 * 
 * // Cache will automatically evict oldest entries when maxSize is reached
 * // and cleanup expired entries every 30 seconds
 * ```
 *
 * @example
 * Advanced usage with events
 * ```typescript
 * const cache = new Cache<User>();
 * 
 * // Listen for events
 * cache.on('set', (key, value) => {
 *   console.log(`Cached ${key}`);
 * });
 * 
 * cache.on('expired', (key) => {
 *   console.log(`${key} expired`);
 * });
 * 
 * cache.on('evicted', (key, reason) => {
 *   console.log(`${key} evicted: ${reason}`);
 * });
 * ```
 *
 * @fires Cache#set When entry is added/updated
 * @fires Cache#delete When entry is removed
 * @fires Cache#expired When entry expires
 * @fires Cache#evicted When entry is evicted due to size limit
 *
 * @see {@link LRUCache} for LRU eviction strategy
 * @see {@link RedisCache} for distributed caching
 * @since 1.0.0
 */
export class Cache<T = unknown> {
  /**
   * Internal storage map.
   *
   * @private
   */
  private store: Map<string, CacheEntry<T>>;

  /**
   * Default TTL in milliseconds.
   *
   * @private
   * @default 3600000 (1 hour)
   */
  private defaultTTL: number;

  /**
   * Maximum number of entries allowed.
   *
   * @private
   * @default 5000
   */
  private maxSize: number;

  /**
   * Cleanup interval timer ID.
   *
   * @private
   */
  private cleanupTimer: NodeJS.Timeout | null;

  /**
   * Cleanup interval in milliseconds.
   *
   * @private
   * @default 60000 (1 minute)
   */
  private cleanupInterval: number;

  /**
   * Creates a new Cache instance.
   *
   * @param options - Cache configuration
   * @param options.defaultTTL - Default TTL for entries (ms)
   * @param options.maxSize - Maximum number of entries
   * @param options.cleanupInterval - Cleanup frequency (ms)
   * @param options.enableEvents - Enable event emission
   *
   * @throws {RangeError} If defaultTTL, maxSize, or cleanupInterval are invalid
   *
   * @example
   * ```typescript
   * const cache = new Cache<User>({
   *   defaultTTL: 300000,     // 5 minutes
   *   maxSize: 10000,
   *   cleanupInterval: 60000  // 1 minute
   * });
   * ```
   */
  constructor(options: CacheOptions = {}) {
    const {
      defaultTTL = 3600000,
      maxSize = 5000,
      cleanupInterval = 60000,
      enableEvents = false
    } = options;

    // Validation
    if (defaultTTL < 0) {
      throw new RangeError('defaultTTL must be non-negative');
    }
    if (maxSize < 1) {
      throw new RangeError('maxSize must be at least 1');
    }
    if (cleanupInterval < 1000) {
      throw new RangeError('cleanupInterval must be at least 1000ms');
    }

    this.store = new Map();
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
    this.cleanupInterval = cleanupInterval;
    this.cleanupTimer = null;

    // Start cleanup timer
    this.startCleanup();
  }

  /**
   * Retrieves a value from cache.
   *
   * Returns undefined if key doesn't exist or entry has expired.
   * Expired entries are automatically removed.
   *
   * @param key - Cache key
   * @returns Cached value or undefined
   *
   * @example
   * ```typescript
   * const user = cache.get('user:123');
   * if (user) {
   *   console.log('Cache hit:', user);
   * } else {
   *   console.log('Cache miss');
   * }
   * ```
   *
   * @public
   */
  public get(key: string): T | undefined {
    const entry = this.store.get(key);
    
    if (!entry) {
      return undefined;
    }

    // Check expiration
    if (this.isExpired(entry)) {
      this.delete(key);
      return undefined;
    }

    // Update last accessed time for LRU
    entry.lastAccessed = Date.now();
    
    return entry.value;
  }

  /**
   * Stores a value in cache.
   *
   * If key already exists, updates the value and resets TTL.
   * If cache is full, evicts oldest entry before adding new one.
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Storage options
   * @param options.ttl - Custom TTL for this entry (ms)
   * @returns True if stored, false if eviction failed
   *
   * @throws {Error} If key is empty string
   *
   * @example
   * ```typescript
   * // Use default TTL
   * cache.set('user:123', user);
   * 
   * // Custom TTL (10 minutes)
   * cache.set('user:456', user, { ttl: 600000 });
   * 
   * // Permanent (no expiration)
   * cache.set('config', config, { ttl: Infinity });
   * ```
   *
   * @fires Cache#set
   * @public
   */
  public set(key: string, value: T, options: SetOptions = {}): boolean {
    if (key === '') {
      throw new Error('Cache key cannot be empty string');
    }

    const { ttl = this.defaultTTL } = options;

    // Evict if at capacity and this is a new key
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      if (!this.evictOldest()) {
        return false; // Eviction failed
      }
    }

    const now = Date.now();
    const entry: CacheEntry<T> = {
      value,
      expiresAt: ttl === Infinity ? Infinity : now + ttl,
      createdAt: now,
      lastAccessed: now
    };

    this.store.set(key, entry);
    this.emit('set', key, value);
    
    return true;
  }

  /**
   * Removes a value from cache.
   *
   * @param key - Cache key to remove
   * @returns True if key existed and was removed, false otherwise
   *
   * @example
   * ```typescript
   * if (cache.delete('user:123')) {
   *   console.log('Entry removed');
   * } else {
   *   console.log('Entry did not exist');
   * }
   * ```
   *
   * @fires Cache#delete
   * @public
   */
  public delete(key: string): boolean {
    const existed = this.store.delete(key);
    if (existed) {
      this.emit('delete', key);
    }
    return existed;
  }

  /**
   * Checks if key exists in cache and is not expired.
   *
   * More efficient than `get()` when you only need to check existence.
   *
   * @param key - Cache key to check
   * @returns True if key exists and is valid, false otherwise
   *
   * @example
   * ```typescript
   * if (cache.has('user:123')) {
   *   console.log('User is cached');
   * } else {
   *   console.log('Need to fetch user');
   * }
   * ```
   *
   * @public
   */
  public has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Clears all entries from cache.
   *
   * Stops cleanup timer and resets internal state.
   *
   * @example
   * ```typescript
   * cache.clear();
   * console.log(cache.size); // 0
   * ```
   *
   * @fires Cache#clear
   * @public
   */
  public clear(): void {
    this.store.clear();
    this.emit('clear');
  }

  /**
   * Current number of entries in cache.
   *
   * Includes expired entries that haven't been cleaned up yet.
   *
   * @readonly
   * @public
   */
  public get size(): number {
    return this.store.size;
  }

  /**
   * Gets cache statistics.
   *
   * Useful for monitoring cache performance and tuning configuration.
   *
   * @returns Cache statistics object
   *
   * @example
   * ```typescript
   * const stats = cache.stats();
   * console.log(`Hit rate: ${stats.hitRate}%`);
   * console.log(`Memory usage: ${stats.memoryUsage}MB`);
   * ```
   *
   * @public
   * @since 1.1.0
   */
  public stats(): CacheStats {
    let totalSize = 0;
    let expiredCount = 0;
    const now = Date.now();

    for (const [key, entry] of this.store.entries()) {
      // Estimate memory usage
      totalSize += key.length * 2; // UTF-16
      totalSize += JSON.stringify(entry.value).length * 2;
      totalSize += 100; // Overhead

      if (this.isExpired(entry)) {
        expiredCount++;
      }
    }

    return {
      size: this.store.size,
      expiredCount,
      memoryUsageBytes: totalSize,
      memoryUsageMB: totalSize / (1024 * 1024),
      maxSize: this.maxSize,
      utilizationPercent: (this.store.size / this.maxSize) * 100
    };
  }

  /**
   * Destroys cache and releases resources.
   *
   * Stops cleanup timer and clears all entries.
   * Cache instance should not be used after calling this method.
   *
   * @example
   * ```typescript
   * // Cleanup on shutdown
   * process.on('SIGTERM', () => {
   *   cache.destroy();
   *   process.exit(0);
   * });
   * ```
   *
   * @public
   */
  public destroy(): void {
    this.stopCleanup();
    this.clear();
  }

  /**
   * Checks if cache entry has expired.
   *
   * @param entry - Cache entry to check
   * @returns True if expired, false otherwise
   * @private
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    if (entry.expiresAt === Infinity) return false;
    return Date.now() > entry.expiresAt;
  }

  /**
   * Evicts the oldest entry from cache.
   *
   * Uses LRU (Least Recently Used) strategy based on lastAccessed timestamp.
   *
   * @returns True if eviction succeeded, false if cache is empty
   * @fires Cache#evicted
   * @private
   */
  private evictOldest(): boolean {
    if (this.store.size === 0) return false;

    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    // Find least recently accessed entry
    for (const [key, entry] of this.store.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey !== null) {
      this.store.delete(oldestKey);
      this.emit('evicted', oldestKey, 'size-limit');
      return true;
    }

    return false;
  }

  /**
   * Removes all expired entries from cache.
   *
   * Called automatically on cleanup interval.
   * Can also be called manually to force cleanup.
   *
   * @returns Number of entries removed
   * @fires Cache#expired for each removed entry
   * @public
   */
  public cleanup(): number {
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.store.delete(key);
      this.emit('expired', key);
    }

    return keysToDelete.length;
  }

  /**
   * Starts automatic cleanup timer.
   * @private
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);

    // Don't prevent process exit
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Stops automatic cleanup timer.
   * @private
   */
  private stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Emits cache events (if enabled).
   * @private
   */
  private emit(event: string, ...args: unknown[]): void {
    // Event emission implementation
    // (requires EventEmitter mixin or similar)
  }
}

/**
 * Cache configuration options.
 *
 * @interface
 */
export interface CacheOptions {
  /**
   * Default time-to-live for cache entries in milliseconds.
   *
   * Can be overridden per-entry with `set()` options.
   *
   * @default 3600000 (1 hour)
   */
  defaultTTL?: number;

  /**
   * Maximum number of entries the cache can hold.
   *
   * When limit is reached, oldest entries are evicted (LRU).
   *
   * @default 5000
   * @minimum 1
   */
  maxSize?: number;

  /**
   * Frequency of automatic cleanup in milliseconds.
   *
   * Lower values increase cleanup frequency but use more CPU.
   * Higher values reduce CPU usage but allow more expired entries.
   *
   * @default 60000 (1 minute)
   * @minimum 1000
   */
  cleanupInterval?: number;

  /**
   * Enable event emission for cache operations.
   *
   * Useful for monitoring and debugging, but adds overhead.
   *
   * @default false
   */
  enableEvents?: boolean;
}

/**
 * Options for cache set operation.
 *
 * @interface
 */
export interface SetOptions {
  /**
   * Time-to-live for this specific entry in milliseconds.
   *
   * Use `Infinity` for no expiration.
   *
   * @optional
   * @example
   * ```typescript
   * // 5 minutes
   * cache.set('key', value, { ttl: 300000 });
   * 
   * // Never expires
   * cache.set('key', value, { ttl: Infinity });
   * ```
   */
  ttl?: number;
}

/**
 * Internal cache entry structure.
 *
 * @interface
 * @template T - Type of cached value
 * @private
 */
interface CacheEntry<T> {
  /**
   * Cached value.
   */
  value: T;

  /**
   * Timestamp when entry expires (ms since epoch).
   */
  expiresAt: number;

  /**
   * Timestamp when entry was created (ms since epoch).
   */
  createdAt: number;

  /**
   * Timestamp of last access (ms since epoch).
   * Used for LRU eviction.
   */
  lastAccessed: number;
}

/**
 * Cache statistics.
 *
 * @interface
 */
export interface CacheStats {
  /**
   * Current number of entries in cache.
   */
  size: number;

  /**
   * Number of expired entries not yet cleaned up.
   */
  expiredCount: number;

  /**
   * Estimated memory usage in bytes.
   * Includes keys, values, and overhead.
   */
  memoryUsageBytes: number;

  /**
   * Estimated memory usage in megabytes.
   */
  memoryUsageMB: number;

  /**
   * Maximum number of entries allowed.
   */
  maxSize: number;

  /**
   * Cache utilization as percentage of maxSize.
   */
  utilizationPercent: number;
}
```

### Type and Interface Documentation

```typescript
/**
 * User account data.
 *
 * Represents a registered user in the system with authentication
 * and authorization information.
 *
 * Security notes:
 * - Password field should never be included in this type
 * - Always use UserDTO for API responses
 * - ID field is immutable after creation
 *
 * @interface
 * @since 1.0.0
 */
export interface User {
  /**
   * Unique user identifier.
   *
   * Format: UUID v4
   * Immutable: Cannot be changed after creation
   *
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  id: string;

  /**
   * User's email address.
   *
   * Must be unique across all users.
   * Used for authentication and communication.
   *
   * Constraints:
   * - Must be valid email format
   * - Case-insensitive unique
   * - Maximum 255 characters
   *
   * @example 'user@example.com'
   */
  email: string;

  /**
   * User's display name.
   *
   * Shown throughout the application UI.
   *
   * Constraints:
   * - 2-50 characters
   * - Unicode support
   * - Cannot be empty string
   *
   * @example 'John Doe'
   * @minimum 2
   * @maximum 50
   */
  name: string;

  /**
   * User's avatar image URL.
   *
   * Optional profile picture displayed in UI.
   *
   * @optional
   * @example 'https://cdn.example.com/avatars/user-123.jpg'
   */
  avatar?: string;

  /**
   * User's assigned roles.
   *
   * Determines permissions and access levels.
   * Multiple roles can be assigned.
   *
   * Available roles:
   * - 'user': Standard user access
   * - 'admin': Full system access
   * - 'moderator': Content moderation access
   *
   * @default ['user']
   */
  roles: Array<'user' | 'admin' | 'moderator'>;

  /**
   * Account creation timestamp.
   *
   * ISO 8601 format in UTC timezone.
   * Immutable: Set once on creation.
   *
   * @example '2024-12-04T10:30:00.000Z'
   * @readonly
   */
  createdAt: string;

  /**
   * Last update timestamp.
   *
   * ISO 8601 format in UTC timezone.
   * Updated on any profile modification.
   *
   * @example '2024-12-04T15:45:00.000Z'
   */
  updatedAt: string;

  /**
   * Account status.
   *
   * Controls user access to the system.
   *
   * Status meanings:
   * - 'active': Normal account, full access
   * - 'suspended': Temporary access restriction
   * - 'banned': Permanent access restriction
   * - 'pending': Awaiting email verification
   *
   * @default 'pending'
   */
  status: 'active' | 'suspended' | 'banned' | 'pending';

  /**
   * User preferences and settings.
   *
   * Flexible object for storing user-specific configuration.
   *
   * @optional
   */
  preferences?: UserPreferences;

  /**
   * Custom metadata.
   *
   * Arbitrary key-value pairs for extensibility.
   * Should not be used for critical data.
   *
   * @optional
   */
  metadata?: Record<string, unknown>;
}

/**
 * User preferences configuration.
 *
 * @interface
 * @since 1.2.0
 */
export interface UserPreferences {
  /**
   * UI theme preference.
   *
   * - 'light': Light mode
   * - 'dark': Dark mode
   * - 'system': Follow system preference
   *
   * @default 'system'
   */
  theme?: 'light' | 'dark' | 'system';

  /**
   * Preferred language/locale.
   *
   * BCP 47 language tag.
   *
   * @default 'en-US'
   * @example 'en-US', 'es-ES', 'ja-JP'
   */
  language?: string;

  /**
   * Email notification settings.
   */
  notifications?: {
    /**
     * Receive product update emails.
     * @default true
     */
    updates?: boolean;

    /**
     * Receive marketing emails.
     * @default false
     */
    marketing?: boolean;

    /**
     * Receive security alerts.
     * @default true
     */
    security?: boolean;
  };

  /**
   * Timezone preference.
   *
   * IANA timezone identifier.
   *
   * @default 'UTC'
   * @example 'America/New_York', 'Europe/London'
   */
  timezone?: string;
}

/**
 * Union type representing API response states.
 *
 * Discriminated union using 'status' as discriminator field.
 * Enables type-safe handling of different response states.
 *
 * @typedef ApiResponse
 * @template T - Type of successful response data
 *
 * @example
 * ```typescript
 * function handleResponse(response: ApiResponse<User>) {
 *   switch (response.status) {
 *     case 'success':
 *       // response.data is User
 *       console.log(response.data.name);
 *       break;
 *     case 'error':
 *       // response.error is string
 *       console.error(response.error);
 *       break;
 *     case 'loading':
 *       // No additional properties
 *       showSpinner();
 *       break;
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 */
export type ApiResponse<T> =
  | {
      /**
       * Success status.
       */
      status: 'success';
      /**
       * Response data.
       */
      data: T;
    }
  | {
      /**
       * Error status.
       */
      status: 'error';
      /**
       * Error message.
       */
      error: string;
      /**
       * Error code for programmatic handling.
       * @optional
       */
      code?: string;
    }
  | {
      /**
       * Loading status.
       */
      status: 'loading';
    };

/**
 * Utility type for making all properties optional recursively.
 *
 * Useful for partial updates and patch operations.
 *
 * @typedef DeepPartial
 * @template T - Type to make partially optional
 *
 * @example
 * ```typescript
 * type UserUpdate = DeepPartial<User>;
 * 
 * const update: UserUpdate = {
 *   name: 'New Name',
 *   preferences: {
 *     theme: 'dark'
 *     // Other preference fields are optional
 *   }
 * };
 * ```
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extracts keys of type T that have values of type V.
 *
 * @typedef KeysOfType
 * @template T - Object type
 * @template V - Value type to match
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   age: number;
 *   active: boolean;
 * }
 * 
 * type StringKeys = KeysOfType<User, string>;
 * // Result: 'id' | 'name'
 * 
 * type NumberKeys = KeysOfType<User, number>;
 * // Result: 'age'
 * ```
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Makes specified properties required.
 *
 * @typedef RequiredKeys
 * @template T - Object type
 * @template K - Keys to make required
 *
 * @example
 * ```typescript
 * interface User {
 *   id?: string;
 *   name?: string;
 *   email?: string;
 * }
 * 
 * type UserWithId = RequiredKeys<User, 'id' | 'email'>;
 * // Result: { id: string; name?: string; email: string; }
 * ```
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Type guard for checking if value is a User object.
 *
 * Performs runtime validation of object structure.
 *
 * @param value - Value to check
 * @returns True if value is a valid User
 *
 * @example
 * ```typescript
 * const data: unknown = await fetchData();
 * 
 * if (isUser(data)) {
 *   // data is now typed as User
 *   console.log(data.name);
 * }
 * ```
 */
export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.roles) &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    typeof obj.status === 'string'
  );
}
```

### Enum and Const Documentation

```typescript
/**
 * HTTP status codes enumeration.
 *
 * Standard HTTP response status codes as defined in RFC 7231.
 * Provides type-safe constants for HTTP status codes.
 *
 * @enum {number}
 * @readonly
 * @see {@link https://tools.ietf.org/html/rfc7231#section-6}
 * @since 1.0.0
 */
export enum HttpStatus {
  /**
   * Request succeeded.
   * @see {@link https://tools.ietf.org/html/rfc7231#section-6.3.1}
   */
  OK = 200,

  /**
   * Resource created successfully.
   * Location header should contain URI of created resource.
   * @see {@link https://tools.ietf.org/html/rfc7231#section-6.3.2}
   */
  CREATED = 201,

  /**
   * Request accepted for processing.
   * Processing not complete.
   * @see {@link https://tools.ietf.org/html/rfc7231#section-6.3.3}
   */
  ACCEPTED = 202,

  /**
   * No