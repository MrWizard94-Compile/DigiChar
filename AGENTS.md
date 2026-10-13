# AGENTS — DigiChar project entry

**Status:** Level 4 project instructions
**Canonical Constitution:** https://github.com/MrWizard94-Compile/Agents-Constitution
**Accepted source commit:** `ded36646c11d61bcfa7e2420b81a278dc98f47e6`

The accepted GitHub repository is the only editable WPAI Constitution source.
Load its `SKILL.md`, `AGENTS.md`, `SOP.md`, `references/always-load.md`, and
applicable `law/*` files from this verified commit. A generated mirror is
usable only when its manifest matches that SHA. This project entry defines
DigiChar-specific requirements; it is not another constitutional copy.

## Project boundaries

- DigiChar is a local-first Tauri 2 desktop financial app. Preserve user data,
  import/export semantics, deterministic calculations, and browser-preview
  fallbacks when changing the native bridge or UI.
- The Ollama assistant may explain financial data, but deterministic DigiChar
  code owns risk and safe-to-spend figures. Do not silently send financial
  prompts or local records to a cloud model.
- `README.md` documents the current stack and commands. `AUDIT_REPORT.md` and
  `MANIFEST.md` describe the July 2026 desktop migration and must not be read
  as evidence of current runtime or governance acceptance.

## Verification

For governance-only edits, validate the pinned Constitution source and its
tests, run `tools/check-adoption.py` against this Git root, then run
`npm run check` and `npm run build`. Those checks cover TypeScript, smoke tests,
Rust unit tests, and the frontend bundle; they do not prove a packaged desktop
binary, installed-state safety, or financial-advice correctness in real use.
Changes affecting native packaging require `npm run desktop:build` and an
installed-app check on the intended Windows device.

The retired `SOUL.md` is recoverable from Git commit
`63cf4ddaa1423e64ce520642e02f78e158ffa75e`; its SHA-256 is
`EB7E72518DF0DD3015989F1B1D1A4C9BDDAC2A1054FEB4A0EFD585FE1ED87A89`.
The canonical source inventory records this variant's provenance.
