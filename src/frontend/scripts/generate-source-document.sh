#!/bin/bash

# Exit on error
set -e

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "This script must be run from the frontend directory"
    exit 1
fi

# Navigate to project root
cd ..

OUTPUT_FILE="SOURCE_CODE.md"

print_step "Generating source code document..."

# Initialize the output file
cat > "$OUTPUT_FILE" << 'EOF'
# Complete Source Code Export

This document contains the complete source code of the project for offline reference.

## Table of Contents

EOF

# Function to add file to document
add_file() {
    local file=$1
    local relative_path=${file#./}
    
    echo "- [$relative_path](#$(echo $relative_path | sed 's/[^a-zA-Z0-9]/-/g' | tr '[:upper:]' '[:lower:]'))" >> "$OUTPUT_FILE"
}

# Function to append file content
append_file() {
    local file=$1
    local relative_path=${file#./}
    
    echo "" >> "$OUTPUT_FILE"
    echo "## $relative_path" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
}

# Build table of contents
print_step "Building table of contents..."

# Backend files
find backend -name "*.mo" -type f | sort | while read file; do
    add_file "$file"
done

# Frontend source files
find frontend/src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json" \) | sort | while read file; do
    add_file "$file"
done

# Config files
for file in dfx.json frontend/package.json frontend/tsconfig.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/components.json frontend/index.html; do
    if [ -f "$file" ]; then
        add_file "$file"
    fi
done

echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "# Source Files" >> "$OUTPUT_FILE"

# Append file contents
print_step "Appending file contents..."

# Backend files
find backend -name "*.mo" -type f | sort | while read file; do
    append_file "$file"
done

# Frontend source files
find frontend/src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.json" \) | sort | while read file; do
    append_file "$file"
done

# Config files
for file in dfx.json frontend/package.json frontend/tsconfig.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/components.json frontend/index.html; do
    if [ -f "$file" ]; then
        append_file "$file"
    fi
done

print_success "Source code document generated: $OUTPUT_FILE"
