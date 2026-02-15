# Specification

## Summary
**Goal:** Restore the ability for authenticated Internet Identity users to create inventory products by fixing backend authorization, adding backend validation with clear errors, and improving the frontend create flow to prevent invalid submits and surface backend error reasons.

**Planned changes:**
- Adjust backend authorization for `createInventoryItem` so logged-in users can create items in a fresh deployment even if admin access control has not been initialized, while still blocking anonymous callers and not expanding admin-only capabilities.
- Add backend input validation for inventory item creation (required text fields and required numeric fields), returning clear, specific error messages on failure.
- Update the frontend inventory create flow to (1) block/disable submission when required fields are empty or numeric inputs are invalid, (2) display backend-provided error reasons in the failure toast, and (3) refresh the inventory list after successful creation so the new item appears immediately.

**User-visible outcome:** Logged-in users can add new inventory products successfully; if something is wrong (e.g., missing description/category or invalid numbers), they see a clear English error message, and successful creations immediately appear in the inventory list without reloading.
