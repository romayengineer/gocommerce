#!/bin/bash

set -e

# Create alias for git command

if command -v wgit &> /dev/null; then
  GIT=wgit
else
  GIT=git
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Vercel Deployment Script${NC}"
echo ""

# Check for uncommitted changes
echo -e "${YELLOW}Checking for uncommitted changes...${NC}"
if ! $GIT diff-index --quiet HEAD --; then
  echo -e "${RED}❌ Error: You have uncommitted changes. Please commit or stash them first.${NC}"
  exit 1
fi

# Check for untracked files
if [ -n "$($GIT ls-files --others --exclude-standard)" ]; then
  echo -e "${RED}❌ Error: You have untracked files. Please add or remove them first.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ No uncommitted changes${NC}"
echo ""

# Check current branch
CURRENT_BRANCH=$($GIT rev-parse --abbrev-ref HEAD)
echo -e "${YELLOW}Checking current branch...${NC}"
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${RED}❌ Error: Current branch is '$CURRENT_BRANCH'. Must be 'main'.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ On branch: $CURRENT_BRANCH${NC}"
echo ""

# Push master/main
echo -e "${YELLOW}Pushing $CURRENT_BRANCH...${NC}"
$GIT push origin "$CURRENT_BRANCH"
echo -e "${GREEN}✓ Pushed $CURRENT_BRANCH${NC}"
echo ""

# Checkout build
echo -e "${YELLOW}Checking out build branch...${NC}"
$GIT checkout build
echo -e "${GREEN}✓ Checked out build branch${NC}"
echo ""

# Pull origin/build
echo -e "${YELLOW}Pulling origin/build...${NC}"
$GIT pull origin build
echo -e "${GREEN}✓ Pulled origin/build${NC}"
echo ""

# Rebase build onto origin/master
echo -e "${YELLOW}Rebasing build onto origin/$CURRENT_BRANCH...${NC}"
$GIT rebase "origin/$CURRENT_BRANCH"
echo -e "${GREEN}✓ Rebased build onto origin/$CURRENT_BRANCH${NC}"
echo ""

# Push build
echo -e "${YELLOW}Pushing build branch...${NC}"
$GIT push origin build
echo -e "${GREEN}✓ Pushed build branch${NC}"
echo ""

# Switch back to master/main
echo -e "${YELLOW}Switching back to $CURRENT_BRANCH...${NC}"
$GIT checkout "$CURRENT_BRANCH"
echo -e "${GREEN}✓ Switched back to $CURRENT_BRANCH${NC}"
echo ""

echo -e "${GREEN}✅ Deployment complete! Vercel will now deploy the build branch.${NC}"
