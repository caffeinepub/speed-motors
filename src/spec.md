# Specification

## Summary
**Goal:** Generate downloadable ZIP build artifacts for the Speed Motors ERP and make them accessible from within the running app.

**Planned changes:**
- Add/complete a packaging workflow that generates `frontend/public/artifacts/app-build.zip`, `frontend/public/artifacts/source-code.zip`, and stages `frontend/public/artifacts/SOURCE_CODE.md` so they are served statically at `/artifacts/`.
- Add a user-facing download area in the app (reachable from the main layout) with links/buttons for `app-build.zip`, `source-code.zip`, and `SOURCE_CODE.md`, including availability/status via a HEAD-based check and disabled/hidden actions when unavailable.
- Complete `frontend/artifacts/DEPLOY_README.md` with step-by-step English instructions for what `app-build.zip` contains and how to extract and deploy/run it using the project’s expected Internet Computer tooling, ensuring it is included in the ZIP root.

**User-visible outcome:** Users can open a download section in the Speed Motors ERP to see whether build artifacts are available and download `app-build.zip`, `source-code.zip`, and `SOURCE_CODE.md` directly from `/artifacts/` when generated.
