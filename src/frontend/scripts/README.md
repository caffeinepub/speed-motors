# Build Artifact Packaging

This directory contains scripts for packaging the application into a deployable ZIP artifact.

## Overview

The packaging workflow builds both backend and frontend components, then assembles them into a single ZIP file containing:
- Backend build outputs (WASM + Candid interface files)
- Frontend production build (static assets)
- Deployment README with setup instructions

## Prerequisites

Before running the packaging script, ensure you have:

1. **dfx** - Internet Computer SDK
   - Install: `sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`
   - Verify: `dfx --version`

2. **pnpm** - Package manager
   - Install: `npm install -g pnpm`
   - Verify: `pnpm --version`

3. **zip** - Archive utility (usually pre-installed on Unix systems)
   - Verify: `zip --version`

## Usage

### Single Command to Generate ZIP

From the **frontend** directory, run:

