# DigiChar Desktop Architecture

## Runtime Shape

DigiChar uses Tauri 2 as the desktop host. The React/Vite frontend is bundled as static assets and loaded into the native WebView. Native behavior is exposed through explicit Rust commands rather than through a long-running local Express server.

## Command Boundary

`src/services/desktopApi.ts` is the only frontend module that imports `@tauri-apps/api/core`. Components call descriptive functions such as `smartCategorize`, `searchCoupons`, `runAppDeconstruction`, `scrapeDeals`, and `askFinancialAdvisor`.

Each bridge function follows the same contract:

- In Tauri, call the matching Rust command.
- In browser preview or tests, use the deterministic local fallback.
- If a desktop command fails, log the command failure and return the fallback result.

This keeps the UI usable during frontend-only development while making the desktop binary independent of a web API server.

## Native Backend

`src-tauri/src/main.rs` owns the native deterministic logic:

- transaction categorization
- coupon and retention strategy generation
- app deconstruction benchmark generation
- trusted parsing of deal-node markup
- safe-to-spend financial advice
- expression evaluation for the native calculation command surface

The current backend is offline-first and does not call cloud services.

## Persistence

The frontend uses WebView `localStorage` for local state and protects startup with guarded JSON parsing in `src/services/persistence.ts`. Corrupt stored JSON is discarded per key instead of crashing the app. Backup and transfer use the JSON/CSV tools in `DataExportImportModal`.

## Security Notes

- No API keys are required by the current desktop build.
- The Tauri capability file grants only core default window permissions plus close, minimize, maximize, and drag commands.
- The configured CSP limits script and asset loading to the app bundle, with development allowances for the Vite server.
- JSON restore validates the expected transaction and subscription shapes before importing data.
