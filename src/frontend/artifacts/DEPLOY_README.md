# Deployment Instructions

This ZIP archive contains a complete build of the application, including both backend and frontend components.

## Contents

- `backend/` - Backend canister build outputs (WASM + Candid interface)
- `frontend/` - Frontend production build (static assets)
- `DEPLOY_README.md` - This file

## Prerequisites

To deploy this application, you need:

1. **dfx** - Internet Computer SDK
   - Install: `sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`
   - Version: 0.15.0 or higher recommended

2. **Node.js** - For serving frontend assets locally (optional)
   - Install: https://nodejs.org/
   - Version: 18.x or higher recommended

## Local Deployment

### Step 1: Extract the Archive

