# Specification

## Summary
**Goal:** Provide a repeatable workflow to build and package the current application into a single downloadable ZIP artifact (backend + frontend) with minimal deployment instructions.

**Planned changes:**
- Add a single command/workflow that runs backend build, frontend production build, and packages outputs into exactly one ZIP in a dedicated artifacts/dist folder.
- Include backend deploy outputs in the ZIP (e.g., wasm + candid/interface files produced by the normal build).
- Include frontend production build output (static assets) in the ZIP.
- Generate a short English README inside the ZIP with prerequisites and steps to deploy locally using `dfx`.
- Ensure packaging failures emit clear, actionable console messages indicating which step failed (backend build, frontend build, or zipping).
- Add a lightweight “Download ZIP” entry-point for developers/operators by clearly printing the ZIP filename and path after a successful run, and documenting the single command to re-run from a clean checkout.

**User-visible outcome:** Developers/operators can run one documented command to produce a single ZIP artifact and easily find its printed location, then use the included README to deploy locally with `dfx`.
