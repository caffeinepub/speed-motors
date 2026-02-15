#!/bin/bash

# Build Artifact Packaging Script
# This script builds the backend and frontend, then packages them into a single ZIP file

set -e  # Exit on any error

echo "=========================================="
echo "Starting Build Artifact Packaging"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Define paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$FRONTEND_DIR")"
ARTIFACTS_DIR="$FRONTEND_DIR/artifacts"
STAGING_DIR="$ARTIFACTS_DIR/staging"
OUTPUT_ZIP="$ARTIFACTS_DIR/app-build.zip"

echo "Project root: $PROJECT_ROOT"
echo "Artifacts directory: $ARTIFACTS_DIR"
echo ""

# Step 1: Clean previous artifacts
echo "Step 1: Cleaning previous artifacts..."
rm -rf "$STAGING_DIR"
rm -f "$OUTPUT_ZIP"
mkdir -p "$STAGING_DIR"
echo -e "${GREEN}✓ Cleaned previous artifacts${NC}"
echo ""

# Step 2: Build backend
echo "Step 2: Building backend..."
cd "$PROJECT_ROOT"
if ! dfx build backend 2>&1; then
    echo -e "${RED}✗ Backend build failed${NC}"
    echo "Error: dfx build backend command failed"
    echo "Make sure dfx is installed and you're in a dfx project directory"
    exit 1
fi
echo -e "${GREEN}✓ Backend build completed${NC}"
echo ""

# Step 3: Build frontend
echo "Step 3: Building frontend..."
cd "$FRONTEND_DIR"
if ! pnpm run build:skip-bindings 2>&1; then
    echo -e "${RED}✗ Frontend build failed${NC}"
    echo "Error: pnpm build command failed"
    echo "Make sure pnpm is installed and dependencies are up to date"
    exit 1
fi
echo -e "${GREEN}✓ Frontend build completed${NC}"
echo ""

# Step 4: Copy build outputs to staging
echo "Step 4: Copying build outputs to staging..."

# Copy backend outputs
mkdir -p "$STAGING_DIR/backend"
if [ -d "$PROJECT_ROOT/.dfx/local/canisters/backend" ]; then
    cp -r "$PROJECT_ROOT/.dfx/local/canisters/backend" "$STAGING_DIR/backend/"
    echo "  - Copied backend canister outputs"
else
    echo -e "${YELLOW}  ! Warning: Backend canister outputs not found at expected location${NC}"
fi

# Copy frontend outputs
mkdir -p "$STAGING_DIR/frontend"
if [ -d "$FRONTEND_DIR/dist" ]; then
    cp -r "$FRONTEND_DIR/dist"/* "$STAGING_DIR/frontend/"
    echo "  - Copied frontend build outputs"
else
    echo -e "${RED}✗ Frontend dist directory not found${NC}"
    exit 1
fi

# Copy deployment README
if [ -f "$ARTIFACTS_DIR/DEPLOY_README.md" ]; then
    cp "$ARTIFACTS_DIR/DEPLOY_README.md" "$STAGING_DIR/"
    echo "  - Copied deployment README"
else
    echo -e "${YELLOW}  ! Warning: DEPLOY_README.md not found${NC}"
fi

echo -e "${GREEN}✓ Build outputs copied to staging${NC}"
echo ""

# Step 5: Create ZIP archive
echo "Step 5: Creating ZIP archive..."
cd "$STAGING_DIR"
if ! zip -r "$OUTPUT_ZIP" . > /dev/null 2>&1; then
    echo -e "${RED}✗ ZIP creation failed${NC}"
    echo "Error: zip command failed"
    echo "Make sure zip utility is installed"
    exit 1
fi
echo -e "${GREEN}✓ ZIP archive created${NC}"
echo ""

# Step 6: Cleanup staging directory
echo "Step 6: Cleaning up staging directory..."
rm -rf "$STAGING_DIR"
echo -e "${GREEN}✓ Staging directory cleaned${NC}"
echo ""

# Success message
echo "=========================================="
echo -e "${GREEN}Build Artifact Packaging Complete!${NC}"
echo "=========================================="
echo ""
echo "Output ZIP file:"
echo "  Location: $OUTPUT_ZIP"
echo "  Filename: app-build.zip"
echo ""
FILE_SIZE=$(du -h "$OUTPUT_ZIP" | cut -f1)
echo "  Size: $FILE_SIZE"
echo ""
echo "Next steps:"
echo "  1. Extract the ZIP file on your deployment target"
echo "  2. Follow instructions in DEPLOY_README.md"
echo ""
