#!/bin/bash

# Exit on error
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the frontend directory"
    exit 1
fi

# Check required tools
print_step "Checking required tools..."
if ! command -v dfx &> /dev/null; then
    print_error "dfx is not installed. Please install dfx first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

if ! command -v zip &> /dev/null; then
    print_error "zip is not installed. Please install zip first."
    exit 1
fi

print_success "All required tools are available"

# Navigate to project root
cd ..

# Step 1: Generate source code document
print_step "Generating source code document..."
if [ -f "frontend/scripts/generate-source-document.sh" ]; then
    bash frontend/scripts/generate-source-document.sh
    print_success "Source code document generated"
else
    print_warning "Source document generation script not found, skipping..."
fi

# Step 2: Build backend
print_step "Building backend canister..."
dfx canister create backend --no-wallet || true
dfx build backend
print_success "Backend built successfully"

# Step 3: Build frontend
print_step "Building frontend..."
cd frontend
pnpm run build:skip-bindings
cd ..
print_success "Frontend built successfully"

# Step 4: Create temporary packaging directory
print_step "Preparing package structure..."
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="$TEMP_DIR/somosora_project"
mkdir -p "$PACKAGE_DIR"

# Copy backend artifacts
print_step "Copying backend artifacts..."
mkdir -p "$PACKAGE_DIR/backend"
cp -r .dfx/local/canisters/backend "$PACKAGE_DIR/backend/"
print_success "Backend artifacts copied"

# Copy frontend build
print_step "Copying frontend build..."
mkdir -p "$PACKAGE_DIR/frontend"
cp -r frontend/dist "$PACKAGE_DIR/frontend/"
print_success "Frontend build copied"

# Copy deployment documentation
print_step "Copying documentation..."
if [ -f "frontend/artifacts/DEPLOY_README.md" ]; then
    cp frontend/artifacts/DEPLOY_README.md "$PACKAGE_DIR/"
    print_success "DEPLOY_README.md copied to package root"
fi

# Copy source code document to package root
if [ -f "SOURCE_CODE.md" ]; then
    cp SOURCE_CODE.md "$PACKAGE_DIR/"
    print_success "SOURCE_CODE.md copied to package root"
fi

# Step 5: Create deployable build ZIP
print_step "Creating deployable build package..."
mkdir -p frontend/artifacts
cd "$TEMP_DIR"
zip -r somosora_project.zip somosora_project/ > /dev/null
cd - > /dev/null
mv "$TEMP_DIR/somosora_project.zip" frontend/artifacts/app-build.zip
print_success "Deployable build package created: frontend/artifacts/app-build.zip"

# Step 6: Create source code ZIP
print_step "Creating full source code package..."
SOURCE_TEMP_DIR=$(mktemp -d)
SOURCE_PACKAGE_DIR="$SOURCE_TEMP_DIR/somosora_project_source"
mkdir -p "$SOURCE_PACKAGE_DIR"

# Copy backend source files
print_step "Copying backend source files..."
mkdir -p "$SOURCE_PACKAGE_DIR/backend"
if [ -d "backend" ]; then
    # Copy .mo files and dfx.json
    find backend -name "*.mo" -exec cp --parents {} "$SOURCE_PACKAGE_DIR/" \;
    if [ -f "dfx.json" ]; then
        cp dfx.json "$SOURCE_PACKAGE_DIR/"
    fi
    print_success "Backend source files copied"
fi

# Copy frontend source files
print_step "Copying frontend source files..."
mkdir -p "$SOURCE_PACKAGE_DIR/frontend"
if [ -d "frontend/src" ]; then
    cp -r frontend/src "$SOURCE_PACKAGE_DIR/frontend/"
fi
if [ -d "frontend/public" ]; then
    cp -r frontend/public "$SOURCE_PACKAGE_DIR/frontend/"
fi
if [ -d "frontend/scripts" ]; then
    cp -r frontend/scripts "$SOURCE_PACKAGE_DIR/frontend/"
fi

# Copy frontend config files
for file in package.json tsconfig.json vite.config.js tailwind.config.js postcss.config.js components.json index.html; do
    if [ -f "frontend/$file" ]; then
        cp "frontend/$file" "$SOURCE_PACKAGE_DIR/frontend/"
    fi
done
print_success "Frontend source files copied"

# Copy root documentation
if [ -f "README.md" ]; then
    cp README.md "$SOURCE_PACKAGE_DIR/"
fi
if [ -f "SOURCE_CODE.md" ]; then
    cp SOURCE_CODE.md "$SOURCE_PACKAGE_DIR/"
fi
if [ -f "frontend/artifacts/DEPLOY_README.md" ]; then
    cp frontend/artifacts/DEPLOY_README.md "$SOURCE_PACKAGE_DIR/"
fi
if [ -f "frontend/scripts/README.md" ]; then
    cp frontend/scripts/README.md "$SOURCE_PACKAGE_DIR/SCRIPTS_README.md"
fi

# Create source ZIP
cd "$SOURCE_TEMP_DIR"
zip -r somosora_project_source.zip somosora_project_source/ > /dev/null
cd - > /dev/null
mv "$SOURCE_TEMP_DIR/somosora_project_source.zip" frontend/public/artifacts/source-code.zip
print_success "Full source code package created: frontend/public/artifacts/source-code.zip"

# Step 7: Copy artifacts to public directory for serving
print_step "Staging artifacts for production serving..."
mkdir -p frontend/public/artifacts

# Copy build ZIP
if [ -f "frontend/artifacts/app-build.zip" ]; then
    cp frontend/artifacts/app-build.zip frontend/public/artifacts/
    print_success "app-build.zip staged to frontend/public/artifacts/"
fi

# Copy source document
if [ -f "SOURCE_CODE.md" ]; then
    cp SOURCE_CODE.md frontend/public/artifacts/
    print_success "SOURCE_CODE.md staged to frontend/public/artifacts/"
fi

# source-code.zip is already in frontend/public/artifacts/

# Cleanup
print_step "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"
rm -rf "$SOURCE_TEMP_DIR"
print_success "Cleanup complete"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Package creation completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Artifacts created:"
echo "  1. frontend/artifacts/app-build.zip"
echo "     └─ Deployable build package (backend WASM + frontend build + docs)"
echo ""
echo "  2. frontend/public/artifacts/source-code.zip"
echo "     └─ Full editable source tree (backend + frontend sources + configs)"
echo ""
echo "  3. frontend/public/artifacts/SOURCE_CODE.md"
echo "     └─ Single markdown file with complete source code"
echo ""
echo "  4. frontend/public/artifacts/app-build.zip"
echo "     └─ Copy of deployable build for production serving"
echo ""
echo "All artifacts in frontend/public/artifacts/ are served at runtime via /artifacts/"
echo ""
echo "To deploy the build package:"
echo "  1. Extract app-build.zip"
echo "  2. Follow instructions in DEPLOY_README.md (included at ZIP root)"
echo ""
echo "To use the source code package:"
echo "  1. Extract source-code.zip"
echo "  2. Run 'pnpm install' in frontend/"
echo "  3. Run 'dfx deploy' from project root"
echo ""
