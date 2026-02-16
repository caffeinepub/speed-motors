# Specification

## Summary
**Goal:** Fix artifact downloads in production and provide a working, downloadable full source-code ZIP export from within the app.

**Planned changes:**
- Ensure the frontend serves static artifact files in production at `/artifacts/app-build.zip` and `/artifacts/SOURCE_CODE.md`, matching what the Dashboard download links expect.
- Generate a new full source-code ZIP (including at minimum `backend/` and `frontend/` sources/config needed to rebuild) and publish it as a static asset under `/artifacts/` for in-app download.
- Update the Dashboard “Full Project Export” area to only show download actions when the corresponding artifact URLs are actually reachable (consistent with `useStaticArtifactAvailability`).
- Update the local packaging workflow scripts and related docs so the documented command produces and stages: the deployable build ZIP, `SOURCE_CODE.md`, and the full source-code ZIP into the frontend’s served `/artifacts/` folder, without breaking the existing `app-build.zip` output.
- Clarify in `frontend/artifacts/DEPLOY_README.md` and `frontend/scripts/README.md` what each artifact contains and where files appear after extracting the ZIP(s) (English only).

**User-visible outcome:** Users can successfully download the build ZIP, `SOURCE_CODE.md`, and a full source-code ZIP from the Dashboard in production, with download buttons shown only when the files are available.
