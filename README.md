# DigiChar Desktop

DigiChar is a local-first desktop financial OS for ADHD-friendly spending decisions, subscription protection, quick transaction entry, budget envelopes, trend visualization, and deterministic deal intelligence.

This repository is the desktop replacement for the original AI Studio web export. The app now runs as a Tauri desktop application with a React/Vite frontend and a Rust command backend. It no longer needs an Express server, Cloud Run URL, or Gemini API key for its current feature set.

## Stack

- React 19 + TypeScript + Vite
- Tauri 2 desktop shell
- Rust native command backend
- Recharts and lucide-react for finance visualization and controls
- Local WebView storage with guarded JSON parsing plus JSON/CSV export tools

## Commands

Install dependencies:

```powershell
npm install
```

Run the browser preview:

```powershell
npm run dev
```

Run the desktop app in development:

```powershell
npm run desktop:dev
```

Run verification:

```powershell
npm run check
```

Build the frontend:

```powershell
npm run build
```

Build the Tauri desktop binary:

```powershell
npm run desktop:build
```

## Desktop Architecture

- `src/services/desktopApi.ts` is the single frontend bridge for native desktop features.
- `src-tauri/src/main.rs` provides deterministic native commands for categorization, coupon strategy, app benchmarking, deal parsing, financial advice, and expression evaluation.
- `src/components/TauriWindowHeader.tsx` uses real Tauri window APIs for close, minimize, maximize, and drag in desktop mode.
- Browser preview remains usable because every native command has a deterministic local fallback.

## Governance

`SOUL.md` is copied from `C:\WPAI\SOULv2.0.0.md` and is the governing production standard for this repo.
