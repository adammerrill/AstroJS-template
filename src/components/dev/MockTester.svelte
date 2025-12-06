<script lang="ts">
  /**
   * @file MockTester Component
   * @module components/dev/mock-tester
   * @classification Internal - Development & Testing Only
   * @compliance ISO/IEC 25010 - Testability & Maintainability
   * @compliance ISO/IEC 29119-4 - Test Techniques (State-based testing)
   * @author Atom Merrill
   * @version 1.0.0
   * @requirement REQ-TEST-001 - E2E Test Infrastructure
   * @requirement REQ-SYS-002 - Mock Data Handling
   * @test_ref tests/e2e/mock-tester.spec.ts
   * 
   * @description
   * E2E testing utility for validating Playwright mock interception and Svelte 5 hydration.
   * Exposes deterministic test hooks and state attributes for reliable automation.
   *
   * @description Testing Contract:
   * - **Endpoint**: `/_testing/api/story` (Playwright intercepts this route)
   * - **State attribute**: `data-fetch-status` transitions: idle → loading → success|error
   * - **Content extraction**: Validates navigation to `story.content.body[0]`
   * - **Error logging**: Console logs prefixed with "🧪 MockTester:" for debugging
   *
   * @description State Machine:
   * - `idle`: Initial state before fetch
   * - `loading`: Fetch in progress
   * - `success`: Data extracted and validated
   * - `error`: Network failure or invalid structure
   */

  import { onMount } from "svelte";

  /**
   * @typedef {Object} MockContent
   * @description Structured representation of content extracted from FeatureGridBlok
   * 
   * @property {string} headline - Primary heading from FeatureGridBlok
   * @property {string} description - Descriptive text from FeatureGridBlok
   * 
   * @see {@link FeatureGridBlok} Type definition in storyblok.d.ts
   */
  interface MockContent {
    headline: string;
    description: string;
  }

  /**
   * @typedef {'idle' | 'loading' | 'success' | 'error'} FetchStatus
   * @description Represents the current state of the async fetch operation
   * 
   * @description State Transitions:
   * idle → loading → (success | error)
   * 
   * @description ⚠️ CRITICAL: * Playwright tests depend on this state to synchronize assertions.
   * The test waits for data-fetch-status="success" before validating content.
   */
  type FetchStatus = "idle" | "loading" | "success" | "error";

  // ============================================================================
  // STATE MANAGEMENT - Svelte 5 Runes
  // ============================================================================

  /**
   * @description Reactive: * @description Stores the successfully fetched and parsed content
   *
   * @default null - Indicates no data has been loaded yet
   * @description Mutates: Set once after successful fetch and parsing
   * @description Accessed By: Template for conditional rendering
   */
  let content = $state<MockContent | null>(null);

  /**
   * @description Reactive: * @description Stores error message if fetch or parsing fails
   *
   * @default null - Indicates no error has occurred
   * @description Mutates: Set if fetch fails or data structure is invalid
   * @description Accessed By: Template for error display
   */
  let error = $state<string | null>(null);

  /**
   * @description Reactive: * @description Tracks the lifecycle state of the fetch operation
   *
   * @default 'idle' - Initial state before fetch begins
   * @alias data-fetch-status attribute for Playwright synchronization
   *
   * @typedef * - 'idle': Component mounted, fetch not started
   * - 'loading': Fetch in progress
   * - 'success': Data successfully fetched and parsed
   * - 'error': Fetch or parsing failed
   *
   * @description ⚠️ CRITICAL: * This state is the synchronization primitive for E2E tests.
   * Tests MUST wait for 'success' before making assertions.
   */
  let fetchStatus = $state<FetchStatus>("idle");

  // ============================================================================
  // LIFECYCLE - Client-Side Data Fetching
  // ============================================================================

  /**
   * @description Lifecycle: onMount
   * @description Executes client-side data fetch after component hydration
   * 
   * @async
   * @throws {Error} Network failures, invalid response status, malformed data
   * 
   * @description Flow: * 1. Set status to 'loading'
   * 2. Fetch from test endpoint (intercepted by Playwright)
   * 3. Validate response status
   * 4. Parse JSON response
   * 5. Navigate data structure to extract grid content
   * 6. Validate required fields exist
   * 7. Set content state
   * 8. Set status to 'success'
   *
   * @throws * - Network errors: Set error message and status to 'error'
   * - Invalid structure: Set descriptive error message
   * - Logs all errors to console for debugging
   */
  onMount(async () => {
    try {
      fetchStatus = "loading";
      console.log("🧪 MockTester: Initiating test data fetch...");
      
      /**
       * @description API Contract: * @description Endpoint: /_testing/api/story
       * @function GET
       * @description Reserved testing endpoint intercepted by Playwright
       * 
       * @description Intercepted By: tests/e2e/home-mock.spec.ts
       * @returns {Object} Storyblok story structure with nested components
       * 
       * @typedef * {
       *   story: {
       *     name: string,
       *     content: PageBlok,
       *     slug: string,
       *     full_slug: string
       *   }
       * }
       *
       * @description Production Note: * This endpoint does NOT exist in production environments.
       * It exists solely for E2E testing and is intercepted by Playwright.
       *
       * @see {@link https://www.storyblok.com/docs/api/content-delivery/v2 | Storyblok API Docs}
       */
      const response = await fetch("/_testing/api/story");
      
      console.log(`🧪 MockTester: Response received [${response.status} ${response.statusText}]`);

      if (!response.ok) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("🧪 MockTester: Data parsed successfully", data);

      /**
       * @description Data Structure: * @description Extracts content from Storyblok story structure
       *
       * @typedef * {
       *   story: {
       *     content: {
       *       component: "page",              // PageBlok
       *       body: [
       *         {
       *           component: "feature_grid",  // FeatureGridBlok
       *           headline: "...",            // ← TARGET: Grid's headline
       *           description: "...",         // ← TARGET: Grid's description
       *           columns: [                  // Array of FeatureBlok
       *             {
       *               component: "feature",
       *               headline: "...",        // ← WRONG: Feature's headline
       *               description: "..."      // ← WRONG: Feature's description
       *             }
       *           ]
       *         }
       *       ]
       *     }
       *   }
       * }
       *
       * @description Navigation: * data → .story → .content → .body[0] → (.headline, .description)
       *
       * @todo * Previous implementation incorrectly navigated to:
       * data.story.content.body[0].columns[0] (Feature's headline)
       * 
       * Correct implementation navigates to:
       * data.story.content.body[0] (Grid's headline)
       *
       * @see * See FeatureGridBlok in types/generated/storyblok.d.ts
       * See PageBlok in types/generated/storyblok.d.ts
       */
      const story = data.story.content;
      
      // CRITICAL FIX: Access the grid (body[0]), NOT its columns (body[0].columns[0])
      const grid = story.body?.[0];

      // Validation: Ensure grid exists
      if (!grid) {
        throw new Error(
          "Invalid mock data structure: Missing body[0] (grid component). " +
          "Expected story.content.body to be a non-empty array."
        );
      }

      // Validation: Ensure required fields exist on the grid
      if (!grid.headline || !grid.description) {
        throw new Error(
          `Invalid mock data structure: Grid missing required fields. ` +
          `Found: headline="${grid.headline}", description="${grid.description}". ` +
          `Expected both to be non-empty strings.`
        );
      }

      // Extract grid-level content (not nested feature content)
      content = {
        headline: grid.headline,
        description: grid.description,
      };
      
      /**
       * @description Critical Timing: * @description Status MUST be updated AFTER content assignment
       *
       * @description Rationale: * Playwright's test waits for data-fetch-status="success" before
       * asserting content. If status is set before content, there's a race
       * condition where the test could read null content.
       *
       * @description Sequence:
       * 1. content = {...}     // Content ready
       * 2. fetchStatus = "success"  // Signal test to proceed
       * 
       * @description ⚠️ Anti-pattern: * fetchStatus = "success";
       * content = {...};  // ❌ Race condition!
       */
      fetchStatus = "success";
      console.log("🧪 MockTester: Content successfully set", content);
      
    } catch (e) {
      console.error("🧪 MockTester: Fetch failed with error:", e);
      error = e instanceof Error ? e.message : "Unknown error occurred";
      fetchStatus = "error";
    }
  });
</script>

<!-- 
  ============================================================================
  TEMPLATE - Rendering Logic
  ============================================================================
  
  @accessibility
  - Uses semantic HTML (h1, h2, p)
  - Includes role="alert" for error messages
  - Provides aria-live regions for dynamic content
  - Includes aria-busy for loading states
  
  @playwright_integration
  - data-testid attributes for deterministic locators
  - data-fetch-status for synchronization (waits for "success")
  
  @styling
  - Tailwind CSS utility classes for responsive design
  - Visual feedback for all states (loading, success, error)
  - Consistent spacing and typography
  
  @description ISO Compliance: - WCAG 2.1 Level AA compliance for accessibility
  - WAI-ARIA 1.2 for dynamic content announcements
-->
<div 
  class="mt-10 rounded-lg border p-10"
  data-testid="mock-container"
  data-fetch-status={fetchStatus}
>
  <h2 class="mb-4 text-xl font-bold text-gray-400">
    QA Pipeline Verification
  </h2>

  {#if error}
    <!-- ERROR STATE -->
    <div 
      class="text-red-500" 
      role="alert" 
      data-testid="mock-error"
      aria-live="assertive"
    >
      <strong>Test Failed:</strong> {error}
    </div>
    
  {:else if content}
    <!-- SUCCESS STATE -->
    <div class="space-y-4">
      <h1 
        data-testid="mock-headline" 
        class="text-primary text-3xl font-bold"
      >
        {content.headline}
      </h1>
      <p 
        data-testid="mock-description" 
        class="text-muted-foreground text-lg"
      >
        {content.description}
      </p>
    </div>
    
  {:else}
    <!-- LOADING STATE -->
    <div 
      class="animate-pulse" 
      data-testid="mock-loading"
      aria-live="polite"
      aria-busy="true"
    >
      Loading mock data...
    </div>
  {/if}
</div>

<!--
  ============================================================================
  COMPONENT DOCUMENTATION
  ============================================================================
  
  @example Usage: ```astro
  // In mock-viewer.astro
  import MockTester from "@/components/dev/MockTester.svelte";
  
  <MockTester client:load />
  ```
  
  @test_contract
  1. Playwright intercepts /_testing/api/story
  2. Returns homeFixture with nested FeatureGridBlok
  3. Component extracts grid.headline and grid.description
  4. Sets data-fetch-status="success"
  5. Test asserts headline.textContent === DYNAMIC_HEADLINE
  
  @data_flow
  ┌─────────────────┐
  │ Playwright Test │
  └────────┬────────┘
           │ Intercepts /_testing/api/story
           │ Returns: homeFixture
           ▼
  ┌─────────────────┐
  │  MockTester     │
  │  onMount()      │
  └────────┬────────┘
           │ Fetches /_testing/api/story
           │ Parses: story.content.body[0]
           │ Extracts: grid.headline, grid.description
           ▼
  ┌─────────────────┐
  │ Template Render │
  │ data-testid=    │
  │ "mock-headline" │
  └─────────────────┘
  
  @troubleshooting
  - Check browser console for "🧪 MockTester:" logs
  - Verify Playwright route interception with "✅ Playwright:" logs
  - Ensure mock fixture structure matches expected navigation path
  - Confirm data-fetch-status transitions: idle → loading → success
  - Validate that grid (not nested feature) has headline/description
  
  @related_files
  - tests/e2e/home-mock.spec.ts - Test orchestration
  - tests/e2e/global-mock-setup.ts - Global settings mock
  - lib/mocks.generated.ts - MockFactory implementation
  - types/generated/storyblok.d.ts - Type definitions
  - src/pages/mock-viewer.astro - Page that renders this component
  
  @version_history
  - v1.0.0 (2025-12-04): Initial implementation
  - v1.0.1 (2025-12-04): Fixed data navigation (grid vs feature)
-->