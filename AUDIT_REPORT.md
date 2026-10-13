# DigiChar Desktop Migration Audit

Audit date: 2026-07-25

Historical migration record. Current governance and verification boundaries
are in `AGENTS.md`; this report does not certify current installed-app behavior.

## Scope

- Current repo target: `C:\Users\Bulkl\OneDrive\Documents\DigiChar`
- Source app found at: `C:\WPAI\Software\digichar`
- Governance read first at the time: the WPAI SOUL v2.0.0 monolith.
- Baseline source check: `npm run lint` passed in `C:\WPAI\Software\digichar`

## Findings

1. The requested repo target already had `.git` but no source files, no commits, and no remote.
2. The actual app source was a Google AI Studio/Vite export under `C:\WPAI\Software\digichar`.
3. The app claimed desktop/Tauri behavior but still depended on an Express web server and `/api/*` HTTP calls.
4. The AI advisor called `/api/deconstruct`, but the server only exposed `/api/app-deconstruct`; that feature could not hit its intended endpoint.
5. The title bar looked native but did not control the native window.
6. The calculator had a `%` key that could only produce an unsupported-token error.
7. App startup trusted raw `localStorage` JSON and could crash on corrupt saved state.
8. Strict no-unused TypeScript checks exposed generated-code import/state noise.
9. AI Studio metadata, dual lockfiles, cloud API env placeholders, and Express/Gemini dependencies were not appropriate for the requested desktop repo.

## Remediation

- Migrated source files into this repo while excluding `node_modules`, logs, build output, and real env files.
- Initialized Git branch naming to `main` and set `origin` to `https://github.com/MrWizard94-Compile/DigiChar.git`.
- Vendored the then-current SOUL v2.0.0, later retired in favor of the
  pinned canonical WPAI Constitution entry in `AGENTS.md`.
- Replaced Express/Gemini server architecture with Tauri 2 and Rust commands.
- Added deterministic local fallbacks for browser preview and tests.
- Wired former HTTP features through `src/services/desktopApi.ts`.
- Made the title bar call real Tauri window APIs.
- Fixed the broken calculator percent action and hardened malformed-number parsing.
- Added guarded persistence helpers and JSON import shape validation.
- Tightened TypeScript compiler checks and removed unused generated imports/state.
- Added frontend smoke tests and Rust command tests.

## Verification Targets

- `npm run lint`
- `npm test`
- `npm run build`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `npm run desktop:build`
