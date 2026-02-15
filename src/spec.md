# Specification

## Summary
**Goal:** Restore a successful build/deploy and add advanced analytics (top-selling, most-searched, and net profit by period) across backend and dashboard.

**Planned changes:**
- Investigate and fix the current build/deploy failure so frontend and backend compile and deploy cleanly without manual steps.
- Add backend aggregation/query methods for: top-selling products (with limit and optional time range), most-searched products (with limit and optional time range), and net profit grouped by requested period (day/week/month) over a selected range.
- Update backend search flow to record bounded per-product search counters needed for “most-searched products,” without changing existing search results.
- Add React Query hooks for the new analytics methods and update the Dashboard to display the three analytics sections with loading/empty states and basic preset range/period controls, using existing i18n helper for all UI strings.

**User-visible outcome:** The app builds and deploys successfully again, and users can view advanced analytics on the Dashboard (top-selling products, most-searched products, and net profit by period) with selectable time ranges/period grouping.
