# Delivery Manifest

## Governance

- `SOUL.md` - Project-local copy of the WPAI SOUL v2.0.0 constitution.

## Desktop Shell

- `src-tauri/Cargo.toml` - Rust package definition for the Tauri backend.
- `src-tauri/build.rs` - Tauri build hook.
- `src-tauri/tauri.conf.json` - Tauri app, window, build, CSP, and bundle configuration.
- `src-tauri/capabilities/default.json` - Least-needed window permissions for the main desktop window.
- `src-tauri/src/main.rs` - Native desktop command backend and Rust tests.
- `src-tauri/icons/icon.ico` - Windows desktop icon required by Tauri resource generation.

## Frontend

- `src/services/desktopApi.ts` - Native command bridge with deterministic preview fallbacks.
- `src/services/persistence.ts` - Guarded local persistence helpers.
- `src/App.tsx` - Uses guarded persistence and correct SOUL version label.
- `src/main.tsx` - Validates the React root element before rendering.
- `src/components/TauriWindowHeader.tsx` - Real desktop window controls and dragging.
- `src/components/AIFinancialAssistantModal.tsx` - Desktop-native financial advice flow.
- `src/components/AppDeconstructBenchmark.tsx` - Desktop-native benchmark analysis flow.
- `src/components/SubscriptionRadar.tsx` - Desktop-native coupon strategy flow.
- `src/components/TransactionsManager.tsx` - Desktop-native smart categorization flow.
- `src/components/DealIntelligence.tsx` - Desktop-native deal parser flow.
- `src/components/FinancialCalculator.tsx` - Fixed percent key and shared expression evaluation path.
- `src/components/AccountsAndEnvelopes.tsx` - Removed unused state and unsafe account-type cast.
- `src/components/ADHDPreferencesModal.tsx` - Typed theme presets without unsafe casts.
- `src/components/DataExportImportModal.tsx` - Validated JSON restore path.
- `src/components/ExecutiveFunctionAssistant.tsx` - Plain-English preference now affects visible wording.
- `src/components/TrendsAndAnalytics.tsx` - Removed unused chart/icon imports.
- `src/engine/shuntingYard.ts` - Rejects malformed decimal tokens.

## Project Configuration

- `package.json` - Desktop-focused npm scripts and dependency set.
- `package-lock.json` - Updated npm lockfile for the desktop dependency graph.
- `tsconfig.json` - Strict TypeScript and no-unused gates.
- `vite.config.ts` - Tauri-friendly Vite dev server and watch settings.
- `index.html` - Desktop app title and metadata.
- `.env.example` - Local-first desktop environment notes.
- `.gitignore` - Ignores npm cache, Tauri targets, build output, env files, and logs.
- `.npmrc` - Project npm settings for clean, local-cache install and verification output.
- `scripts/create-icon.mjs` - Deterministic icon generator for the Tauri Windows icon.
- `README.md` - Desktop app setup, commands, architecture, and governance.
- `AUDIT_REPORT.md` - Source audit findings, remediation, and verification targets.

## Removed Web Export Artifacts

- `server.ts` - Express/Gemini web server removed.
- `metadata.json` - Google AI Studio metadata removed.
- `bun.lock` - Removed to keep npm as the single package manager.
- `assets/.aistudio/.gitignore` - AI Studio export placeholder removed.
