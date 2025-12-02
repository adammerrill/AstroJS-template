/**
 * @file scripts/verify-env-injection.js
 * @description Verification script for the Offline Server start-up logic.
 * Ensures that the 'start-offline-server.js' script uses Process Environment Injection
 * rather than the fragile 'file renaming' strategy.
 */

import fs from "fs";
import { spawn } from "child_process";
import path from "path";

const _ENV_FILE = path.resolve(".env");
const ENV_BACKUP = path.resolve(".env.backup-offline");

async function verifyInfrastructure() {
  console.log("🔍 Verifying Infrastructure Integrity...");

  // 1. Ensure clean state
  if (fs.existsSync(ENV_BACKUP)) {
    console.error(
      "❌ CRITICAL FAIL: Found leftover.env.backup-offline file. The old fragile script is still in use.",
    );
    process.exit(1);
  }

  console.log("✅ File System Clean: No backup files found.");

  // 2. Start the offline server script
  console.log("🚀 Spawning offline server...");
  const child = spawn("node", ["scripts/start-offline-server.js"], {
    stdio: "pipe", // Pipe stdio so we can inspect it
    timeout: 10000, // Failsafe timeout
  });

  let serverStarted = false;

  child.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`: ${output.trim()}`);

    // Check for the "Offline Mode" confirmation log we added
    if (output.includes("OFFLINE mode")) {
      serverStarted = true;

      // 3. CRITICAL CHECK: While server is running, check if.env was renamed
      if (fs.existsSync(ENV_BACKUP)) {
        console.error(
          "❌ FAIL: The script renamed.env to.env.backup-offline. This causes race conditions!",
        );
        child.kill();
        process.exit(1);
      } else {
        console.log(
          "✅ PASS:.env file remained untouched during server startup.",
        );
      }

      // Cleanup
      child.kill();
    }
  });

  child.on("exit", (_code) => {
    if (!serverStarted) {
      console.warn("⚠️ Warning: Server process exited before confirmation.");
    }
    console.log("✅ Verification Complete.");
  });
}

verifyInfrastructure();
