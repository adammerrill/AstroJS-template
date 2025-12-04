<script lang="ts">
  /**
   * @component MockTester
   * @description E2E testing utility component for validating Playwright mock interception.
   * 
   * @purpose
   * Performs client-side fetch to validate:
   * - Playwright route interception pipeline
   * - Svelte 5 hydration with runes
   * - Type-safe mock data consumption
   * 
   * @architecture
   * - Uses Svelte 5 runes ($state) for reactive state management
   * - Implements deterministic status tracking via data attributes
   * - Exposes fetch lifecycle states for Playwright synchronization
   * 
   * @testing_contract
   * - Exposes `data-fetch-status` attribute: 'idle' | 'loading' | 'success' | 'error'
   * - Exposes `data-testid` attributes for Playwright locators
   * - Logs detailed console output for debugging CI/CD failures
   * 
   * @iso_compliance
   * - ISO/IEC 25010:2011 - Software Quality Requirements (Testability)
   * - ISO/IEC 29119-4:2015 - Test Techniques (State-based testing)
   * 
   * @see {@link https://playwright.dev/docs/api/class-route | Playwright Route API}
   * @see {@link https://svelte.dev/docs/svelte/$state | Svelte 5 Runes}
   * 
   * @module components/dev/MockTester
   * @requires svelte
   * @version 1.0.0
   * @since 2025-12-04
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
   * @state_transitions
   * idle → loading → (success | error)
   * 
   * @critical
   * Playwright tests depend on this state to synchronize assertions.
   * The test waits for data-fetch-status="success" before validating content.
   */
  type FetchStatus = "idle" | "loading" | "success" | "error";

  // ============================================================================
  // STATE MANAGEMENT - Svelte 5 Runes
  // ============================================================================

  /**
   * @reactive
   * @description Stores the successfully fetched and parsed content
   * 
   * @default null - Indicates no data has been loaded yet
   * @mutates Set once after successful fetch and parsing
   * @accessed_by Template for conditional rendering
   */
  let content = $state<MockContent | null>(null);

  /**
   * @reactive
   * @description Stores error message if fetch or parsing fails
   * 
   * @default null - Indicates no error has occurred
   * @mutates Set if fetch fails or data structure is invalid
   * @accessed_by Template for error display
   */
  let error = $state<string | null>(null);

  /**
   * @reactive
   * @description Tracks the lifecycle state of the fetch operation
   * 
   * @default 'idle' - Initial state before fetch begins
   * @exposed_as data-fetch-status attribute for Playwright synchronization
   * 
   * @states
   * - 'idle': Component mounted, fetch not started
   * - 'loading': Fetch in progress
   * - 'success': Data successfully fetched and parsed
   * - 'error': Fetch or parsing failed
   * 
   * @critical
   * This state is the synchronization primitive for E2E tests.
   * Tests MUST wait for 'success' before making assertions.
   */
  let fetchStatus = $state<FetchStatus>("idle");

  // ============================================================================
  // LIFECYCLE - Client-Side Data Fetching
  // ============================================================================

  /**
   * @lifecycle onMount
   * @description Executes client-side data fetch after component hydration
   * 
   * @async
   * @throws {Error} Network failures, invalid response status, malformed data
   * 
   * @flow
   * 1. Set status to 'loading'
   * 2. Fetch from test endpoint (intercepted by Playwright)
   * 3. Validate response status
   * 4. Parse JSON response
   * 5. Navigate data structure to extract grid content
   * 6. Validate required fields exist
   * 7. Set content state
   * 8. Set status to 'success'
   * 
   * @error_handling
   * - Network errors: Set error message and status to 'error'
   * - Invalid structure: Set descriptive error message
   * - Logs all errors to console for debugging
   */
  onMount(async () => {
    try {
      fetchStatus = "loading";
      console.log("🧪 MockTester: Initiating test data fetch...");
      
      /**
       * @api_contract
       * @endpoint /_testing/api/story
       * @method GET
       * @description Reserved testing endpoint intercepted by Playwright
       * 
       * @intercepted_by tests/e2e/home-mock.spec.ts
       * @returns {Object} Storyblok story structure with nested components
       * 
       * @response_structure
       * {
       *   story: {
       *     name: string,
       *     content: PageBlok,
       *     slug: string,
       *     full_slug: string
       *   }
       * }
       * 
       * @production_note
       * This endpoint does NOT exist in production environments.
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
       * @data_structure_navigation
       * @description Extracts content from Storyblok story structure
       * 
       * @expected_structure
       * {
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
       * @navigation_path
       * data → .story → .content → .body[0] → (.headline, .description)
       * 
       * @critical_fix
       * Previous implementation incorrectly navigated to:
       * data.story.content.body[0].columns[0] (Feature's headline)
       * 
       * Correct implementation navigates to:
       * data.story.content.body[0] (Grid's headline)
       * 
       * @type_reference
       * See FeatureGridBlok in types/generated/storyblok.d.ts
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
       * @critical_timing
       * @description Status MUST be updated AFTER content assignment
       * 
       * @rationale
       * Playwright's test waits for data-fetch-status="success" before
       * asserting content. If status is set before content, there's a race
       * condition where the test could read null content.
       * 
       * @sequence
       * 1. content = {...}     // Content ready
       * 2. fetchStatus = "success"  // Signal test to proceed
       * 
       * @antipattern
       * fetchStatus = "success";
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
  
  @iso_compliance
  - WCAG 2.1 Level AA compliance for accessibility
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
  
  @usage
  ```astro
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
  