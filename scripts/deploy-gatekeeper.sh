#!/bin/bash

# @file scripts/deploy-gatekeeper.sh
# @description 
#   Automated Pre-Flight Check & Commit Script.
#   Ensures all quality gates (Lint, Typecheck, Tests) pass before committing 
#   to prevent broken deployments to Vercel.
#
# @usage
#   chmod +x scripts/deploy-gatekeeper.sh
#   ./scripts/deploy-gatekeeper.sh "fix: resolve critical e2e pipeline failures"

set -e # Exit immediately if any command fails

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Deployment Gatekeeper...${NC}"

# -----------------------------------------------------------------------------
# 1. Static Analysis (Fastest checks first)
# -----------------------------------------------------------------------------
echo -e "\n${BLUE}[1/5] Running Static Analysis (Lint & Types)...${NC}"
pnpm lint
pnpm typecheck
echo -e "${GREEN}✓ Static Analysis Passed${NC}"

# -----------------------------------------------------------------------------
# 2. Unit Tests
# -----------------------------------------------------------------------------
echo -e "\n${BLUE}[2/5] Running Unit Tests...${NC}"
pnpm test:unit
echo -e "${GREEN}✓ Unit Tests Passed${NC}"

# -----------------------------------------------------------------------------
# 3. Offline Resilience Tests (Epic 1)
# -----------------------------------------------------------------------------
echo -e "\n${BLUE}[3/5] Verifying Offline Infrastructure...${NC}"
pnpm test:e2e:offline
echo -e "${GREEN}✓ Offline Infrastructure Verified${NC}"

# -----------------------------------------------------------------------------
# 4. Visual Regression Tests (Epic 3)
# -----------------------------------------------------------------------------
echo -e "\n${BLUE}[4/5] Verifying Visual Stability...${NC}"
# Note: We do NOT update snapshots here; we verify against existing baselines.
pnpm test:e2e:visual
echo -e "${GREEN}✓ Visual Regression Passed${NC}"

# -----------------------------------------------------------------------------
# 5. Commit & Push
# -----------------------------------------------------------------------------
echo -e "\n${BLUE}[5/5] All Gates Passed. Committing changes...${NC}"

# Stage all changes
git add .

# Commit with provided message or default
COMMIT_MSG=${1:-"chore(ci): stabilize e2e pipeline and visual regression"}
git commit -m "$COMMIT_MSG"

echo -e "\n${GREEN}✅ Success! Code committed locally.${NC}"
echo -e "You can now push to GitHub to trigger the Vercel deployment:"
echo -e "${BLUE}git push origin main${NC}"