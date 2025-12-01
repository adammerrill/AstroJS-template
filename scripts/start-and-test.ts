/**
 * @fileoverview Async orchestration for Astro dev server + Playwright tests.
 *
 * This module provides functionality to:
 * - Start the Astro development server on a specified host and port
 * - Wait for the server to be ready
 * - Execute Playwright tests against the running server
 * - Ensure proper cleanup and termination of child processes
 * - Forward system signals to all child processes
 *
 * The server is terminated immediately after test completion with a fallback
 * timeout mechanism for forceful termination if graceful shutdown fails.
 *
 * @author Atom Merrill
 * @license MIT
 *
 * @remarks
 * Fully ESM and TypeScript compliant. Uses only ASCII characters in source.
 * Compatible with ISO standard text encoding requirements.
 */

import { spawn, ChildProcess } from "child_process";
import type { SpawnOptions } from "child_process";
import waitOn from "wait-on";

/**
 * Result of a spawned process execution.
 */
type SpawnResult = {
  code: number | null;
  signal: NodeJS.Signals | null;
};

/**
 * Registry of active child processes for signal forwarding.
 * @internal
 */
const activeChildren: ChildProcess[] = [];

/**
 * Spawn a child process and wait for its completion.
 * @param cmd Command to execute
 * @param args Command line arguments
 * @param options Spawn options
 * @returns Promise resolving with exit code and signal
 * @throws Error if spawn fails
 */
export function spawnAsync(
  cmd: string,
  args: string[],
  options: SpawnOptions = {},
): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      ...options,
      shell: true,
      stdio: "inherit",
    });
    activeChildren.push(child);

    child.on("error", (err: Error) => reject(err));

    child.on("exit", (code: number | null, signal: NodeJS.Signals | null) => {
      const index = activeChildren.indexOf(child);
      if (index >= 0) activeChildren.splice(index, 1);
      resolve({ code, signal });
    });
  });
}

/**
 * Forward a system signal to all active child processes.
 * @param sig Signal name (e.g., SIGINT, SIGTERM)
 * @internal
 */
function handleSignal(sig: NodeJS.Signals): void {
  console.log(`Orchestrator received ${sig}; forwarding to children...`);
  activeChildren.forEach((child: ChildProcess) => {
    try {
      if (!child.killed) child.kill(sig);
    } catch (err) {
      console.warn(`Failed to forward signal ${sig} to child:`, err);
    }
  });
}

/**
 * Main orchestration function for server + test execution.
 * @returns Promise resolving with Playwright test result
 * @throws Error if server fails or tests cannot run
 */
export async function run(): Promise<SpawnResult> {
  // Register signals
  (["SIGINT", "SIGTERM", "SIGHUP"] as NodeJS.Signals[]).forEach((sig) => {
    process.on(sig, () => handleSignal(sig));
  });

  let serverChild: ChildProcess | null = null;

  try {
    console.log("Starting Astro dev server...");
    serverChild = spawn(
      "pnpm",
      ["dev", "--", "--host", "127.0.0.1", "--port", "4321"],
      {
        shell: true,
        stdio: "inherit",
      },
    );
    activeChildren.push(serverChild);

    serverChild.on("error", (err) => {
      console.error("Failed to spawn server:", err);
      process.exit(1);
    });

    await waitOn({
      resources: ["https://127.0.0.1:4321"],
      timeout: 120_000,
      strictSSL: false, // This is crucial for mkcert
    });

    console.log("Server ready. Starting Playwright tests...");

    const testResult = await spawnAsync(
      "pnpm",
      ["exec", "--", "playwright", "test"],
      {
        env: { ...process.env, SKIP_PW_SERVER: "true" },
      },
    );

    // Graceful shutdown
    if (serverChild && !serverChild.killed) {
      console.log("Stopping Astro dev server...");

      const killPromise = new Promise<void>((resolve) => {
        serverChild?.on("exit", () => resolve());
        serverChild?.on("error", () => resolve()); // Ignore errors during kill
        serverChild?.kill("SIGTERM");
      });

      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 5000));

      await Promise.race([timeout, killPromise]);

      if (!serverChild.killed) {
        console.log("Forcibly killing server...");
        serverChild.kill("SIGKILL");
      }
    }

    return testResult;
  } catch (err) {
    console.error("Error during orchestration:", err);
    handleSignal("SIGTERM");
    process.exit(1);
  }
}

/**
 * ESM entry point for direct execution.
 * @internal
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((err) => {
    console.error("Fatal error in orchestrator:", err);
    handleSignal("SIGTERM");
    process.exit(1);
  });
}
