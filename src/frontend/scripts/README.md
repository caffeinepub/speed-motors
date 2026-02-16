# Build Artifact Packaging Workflow

This directory contains scripts for packaging the application into distributable artifacts.

## Overview

The packaging workflow generates three types of artifacts:

1. **app-build.zip** - Deployable build package containing compiled backend and frontend
2. **source-code.zip** - Full editable source tree for development and rebuilding
3. **SOURCE_CODE.md** - Single Markdown file with complete source code for offline reading

All artifacts are staged into `frontend/public/artifacts/` so they are served at runtime via `/artifacts/` paths.

## Prerequisites

- **dfx**: Internet Computer SDK for building backend canisters
- **pnpm**: Package manager for frontend dependencies
- **zip**: Command-line utility for creating ZIP archives
- **bash**: Shell for running the packaging scripts

## Usage

### Generate All Artifacts

From the `frontend` directory, run:

