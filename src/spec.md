# Specification

## Summary
**Goal:** Localize the entire existing ERP frontend UI to Spanish, making Spanish the default and removing remaining user-facing English strings.

**Planned changes:**
- Replace hard-coded English UI strings with Spanish across the existing modules: sidebar navigation, header/search, Global Search modal, pages, dialogs, empty states, alerts, and toast messages.
- Translate module-specific UI copy for Inventory, Rates, Customers (list + detail, including the error state and “backend integration required” block), and placeholder pages (Sales, Cashbox, Suppliers, Closures, Dashboard).
- Ensure localization updates do not change existing functionality (routing, forms, queries/mutations, toasts) and do not touch immutable frontend paths or require backend changes.

**User-visible outcome:** The application UI appears in Spanish throughout all currently implemented frontend modules, with navigation, search, pages, alerts, and toasts fully translated and functioning as before.
