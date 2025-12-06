#!/usr/bin/env node
/**
 * @file Offline Server Entry Point (ISO/ASCII Compliant)
 * @description Starts the Astro development server in Offline Mode by sanitizing
 * the Storyblok API token from the environment. This approach eliminates the need
 * for file system mutations (no .env renaming) and ensures a clean, deterministic
 * offline testing environment.
 *
 * Architectural Rationale:
 * - Environment Variable Injection: Overrides STORYBLOK_DELIVERY_API_TOKEN with
 *   an empty string, triggering the `isOffline` check in src/lib/storyblok.ts.
 * - Direct Process Spawning: Uses `shell: false` for precise PID control and
 *   reliable signal propagation (SIGINT/SIGTERM).
 * - No File System Cleanup: Eliminates the risk of orphaned .env backups or
 *   permission errors during restoration.
 *
 * Usage:
 *   node --loader tsx scripts/start-offline-server.ts
 *   # or via package.json script: pnpm run dev:offline
 *
 * @module scripts/start-offline-server
 * @author Atom Merrill
 * @version 2.0.0
 * @license MIT
 */

import { spawn, type ChildProcess } from "child_process";
import path from "path";
import fs from "fs";

/* -------------------------------------------------------------------------- */
/*                            Configuration                                   */
/* -------------------------------------------------------------------------- */

const OFFLINE_HOST = "127.0.0.1";
const OFFLINE_PORT = 4322; // Distinct from default 4321

/**
 * Registry of active child processes for cleanup on exit.
 * @internal
 */
let serverProcess: ChildProcess | null = null;

/* -------------------------------------------------------------------------- */
/*                            Utility Functions                               */
/* -------------------------------------------------------------------------- */

/**
 * Normalizes an executable path for the current operating system.
 * Appends '.cmd' on Windows platforms for npm binaries.
 *
 * @param {string} cmd - The base command or path to executable.
 * @returns {string} The OS-appropriate executable path.
 */
function getExecutable(cmd: string): string {
  if (process.platform !== "win32") return cmd;
  return cmd.endsWith(".cmd") ? cmd : `${cmd}.cmd`;
}

/**
 * Resolves the absolute path to the Astro CLI binary.
 * Attempts to locate the binary in node_modules/.bin, falling back to
 * the direct astro.js script if the symlink is unavailable.
 *
 * @returns {{ executable: string; args: string[] }} Resolved command and arguments.
 */
function resolveAstroCommand(): { executable: string; args: string[] } {
  const binPath = path.resolve(process.cwd(), "node_modules", ".bin", "astro");
  const scriptPath = path.resolve(
    process.cwd(),
    "node_modules",
    "astro",
    "astro.js",
  );

  // Check for Windows .cmd shim
  if (process.platform === "win32" && fs.existsSync(`${binPath}.cmd`)) {
    return {
      executable: `${binPath}.cmd`,
      args: ["dev", "--host", OFFLINE_HOST, "--port", String(OFFLINE_PORT)],
    };
  }

  // Check for Unix symlink
  if (fs.existsSync(binPath)) {
    return {
      executable: binPath,
      args: ["dev", "--host", OFFLINE_HOST, "--port", String(OFFLINE_PORT)],
    };
  }

  // Fallback: Direct Node invocation
  return {
    executable: getExecutable("node"),
    args: [
      scriptPath,
      "dev",
      "--host",
      OFFLINE_HOST,
      "--port",
      String(OFFLINE_PORT),
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*                         Process Management                                 */
/* -------------------------------------------------------------------------- */

/**
 * Gracefully terminates the server process.
 * Attempts SIGTERM first, with a fallback to SIGKILL after a timeout.
 *
 * @param {NodeJS.Signals} [signal="SIGTERM"] - The signal to send.
 */
function terminateServer(signal: NodeJS.Signals = "SIGTERM"): void {
  if (serverProcess && !serverProcess.killed) {
    console.log(`\n[offline-server] Sending ${signal} to Astro process...`);
    try {
      serverProcess.kill(signal);
    } catch (err) {
      console.warn(`[offline-server] Failed to send ${signal}:`, err);
    }
  }
}

/**
 * Registers signal handlers to ensure graceful shutdown of the Astro process.
 * Forwards SIGINT and SIGTERM to the child process before exiting.
 *
 * @internal
 */
function registerSignalHandlers(): void {
  // Handle Ctrl+C (SIGINT)
  process.on("SIGINT", () => {
    console.log("\n[offline-server] Received SIGINT (Ctrl+C)...");
    terminateServer("SIGINT");
    // The 'close' event handler will call process.exit()
  });

  // Handle termination request (SIGTERM)
  process.on("SIGTERM", () => {
    console.log("\n[offline-server] Received SIGTERM...");
    terminateServer("SIGTERM");
  });

  // Safety net: Ensure cleanup on unexpected exit
  process.on("exit", () => {
    if (serverProcess && !serverProcess.killed) {
      console.log(
        "[offline-server] Parent process exiting — terminating Astro...",
      );
      terminateServer("SIGKILL");
    }
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("\n[offline-server] Uncaught exception:", err);
    terminateServer("SIGTERM");
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason) => {
    console.error("\n[offline-server] Unhandled rejection:", reason);
    terminateServer("SIGTERM");
    process.exit(1);
  });
}

/* -------------------------------------------------------------------------- */
/*                              Main Entry Point                              */
/* -------------------------------------------------------------------------- */

/**
 * Main orchestration function for offline server startup.
 *
 * Workflow:
 * 1. Clones the current environment and sanitizes the Storyblok API token.
 * 2. Resolves the Astro CLI command (binary or fallback script).
 * 3. Spawns the Astro dev server with the sanitized environment.
 * 4. Registers signal handlers for graceful shutdown.
 * 5. Forwards server stdout/stderr to the parent process.
 *
 * @throws {Error} If the Astro process fails to spawn.
 */
function startOfflineServer(): void {
  console.log("=".repeat(70));
  console.log("🚀 Starting Astro Development Server in OFFLINE MODE");
  console.log("=".repeat(70));
  console.log(`📍 Server URL: https://${OFFLINE_HOST}:${OFFLINE_PORT}`);
  console.log("⚠️  API Token Disabled — Using Local Fixtures\n");

  // Clone environment and sanitize the Storyblok API token
  // This triggers the `isOffline` check in src/lib/storyblok.ts
  const sanitizedEnv = {
    ...process.env,
    STORYBLOK_DELIVERY_API_TOKEN: "", // Empty string = offline mode
    IS_OFFLINE: "true", // Explicit offline flag
    FORCE_COLOR: "1", // Preserve colored output
  };

  // Resolve the Astro command
  const { executable, args } = resolveAstroCommand();

  console.log(`[offline-server] Executing: ${executable} ${args.join(" ")}\n`);

  // Spawn the Astro dev server with sanitized environment
  try {
    serverProcess = spawn(executable, args, {
      shell: false, // Direct spawning for PID control
      stdio: "inherit", // Forward stdout/stderr to parent
      env: sanitizedEnv, // Inject sanitized environment
    });
  } catch (err) {
    console.error("[offline-server] Failed to spawn Astro process:", err);
    process.exit(1);
  }

  // Register signal handlers for graceful shutdown
  registerSignalHandlers();

  // Handle spawn errors
  serverProcess.on("error", (err) => {
    console.error("\n[offline-server] Astro process error:", err);
    process.exit(1);
  });

  // Handle server exit
  serverProcess.on("close", (code, signal) => {
    if (signal) {
      console.log(`\n[offline-server] Astro terminated by signal: ${signal}`);
    } else {
      console.log(`\n[offline-server] Astro exited with code: ${code ?? 0}`);
    }

    // Exit with the same code as the child process
    process.exit(code ?? 0);
  });

  console.log("[offline-server] Server process started successfully.");
  console.log("[offline-server] Press Ctrl+C to stop the server.\n");
}

/* -------------------------------------------------------------------------- */
/*                            ESM Entry Guard                                 */
/* -------------------------------------------------------------------------- */

/**
 * Entry point guard for direct script execution.
 * Ensures this module only runs when invoked directly via Node.js.
 *
 * @internal
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  startOfflineServer();
}

/**
 * Export for programmatic usage (e.g., in tests or other orchestrators).
 */
export { startOfflineServer };
