<script lang="ts">
    /**
     * @component MockTester
     * @description E2E Utility component.
     * Performs a client-side fetch to a specific URL that Playwright will intercept.
     */
    import { onMount } from 'svelte';
  
    let content = $state<{ headline: string; description: string } | null>(null);
    let error = $state<string | null>(null);
  
    onMount(async () => {
    try {
        console.log("🧪 MockTester: Fetching from API...");
        const response = await fetch('https://api.mock-test.com/story');
        console.log("🧪 MockTester: Response received", response.status);
        
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        
        const data = await response.json();
        console.log("🧪 MockTester: Data parsed", data);
        
        const story = data.story.content;
        const feature = story.body[0].columns[0];
        
        content = {
        headline: feature.headline,
        description: feature.description
        };
        console.log("🧪 MockTester: Content set", content);
    } catch (e) {
        console.error("🧪 MockTester: Fetch failed", e);
        error = e instanceof Error ? e.message : 'Unknown error';
    }
    });
  </script>
  
  <div class="p-10 border rounded-lg mt-10">
    <h2 class="text-xl font-bold mb-4 text-gray-400">QA Pipeline Verification</h2>
    
    {#if error}
      <div class="text-red-500" role="alert">Failed: {error}</div>
    {:else if content}
      <div class="space-y-4">
        <!-- Data Test IDs ensure robust selection in Playwright -->
        <h1 data-testid="mock-headline" class="text-3xl font-bold text-primary">
          {content.headline}
        </h1>
        <p data-testid="mock-description" class="text-lg text-muted-foreground">
          {content.description}
        </p>
      </div>
    {:else}
      <div class="animate-pulse">Loading mock data...</div>
    {/if}
  </div>