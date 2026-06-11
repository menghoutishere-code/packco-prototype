# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PackCo.ai demo app for UniPreneur Season 4 — a packaging-as-a-service tool for Cambodian micro food producers. A single-page React/Vite frontend plus Vercel-style serverless functions in `api/` that drive a three-stage AI pipeline: **Compliance Label → Brand Logo → 3D Product Mockup**. The parent folder (`../`) holds the non-code business material (research, validation, business plan); this `prototype-app/` folder is the git repo and the only code.

## Commands

Run all from `prototype-app/`:

- `npm run dev` — local dev server. Also executes the `api/` handlers locally (see dev-api below); needs `.env`.
- `npm run build` / `npm run preview` — production build to `dist/` and preview it.
- `npm run lint` — ESLint (flat config, `eslint.config.js`). There is no test runner; the `scripts/_*.mjs` files are ad-hoc manual probes, not a suite.
- Pre-bake demo assets (require `GEMINI_API_KEY` in env): `node scripts/build-mockups.mjs` regenerates `api/_mockups.js`; `node scripts/build-heroes.mjs` regenerates the `/public/hero/*` fallback shots.

Env vars (`.env` for local, mirrored in Vercel project settings): `GEMINI_API_KEY` (required), `GEMINI_IMAGE_MODEL` (optional, default `gemini-3.1-flash-image`), `DEMO_USER`/`DEMO_PASS` (gate login, default `admin`/`packco2026`).

## Architecture

**Two runtimes, one `api/` directory.** The handlers in `api/*.js` are written as Vercel serverless functions (`export default function handler(req, res)` with `res.status().json()`). Vite does **not** run them on its own, so `scripts/vite-dev-api.js` is a dev-only Vite plugin that shims a Vercel-compatible `req`/`res` and executes the same files during `npm run dev`. **Consequence:** any handler must work under both — keep them filesystem-free and read everything from `process.env`. This is why blank mockup images are base64-baked into `api/_mockups.js` (via `build-mockups.mjs`) rather than read from disk.

**The image pipeline is the core idea.** Two distinct Gemini model families are used on purpose:
- `api/generate.js` → **text** model (`gemini-2.5-pro`, JSON-mode) acting as a Cambodian labeling-compliance officer. Returns structured label JSON (Khmer ingredients, nutrition, mandatory warnings) per Cambodia's Law on Food Safety (2022) / Standard CS 001-2000. Output is parsed defensively (strips markdown fences, falls back to first `{...}` block).
- `api/logo.js` and `api/mockup.js` → **image** model (Nano Banana, `gemini-3.1-flash-image`). `logo.js` generates a flat logo on pure white (so it can be multiply-composited). `mockup.js` is **image-to-image**: it takes a blank package photo (Image 1, from `_mockups.js`) + clean front-of-pack artwork (Image 2) and prints the artwork onto the package.

**Per-mockup geometry prompts.** `api/mockup.js` keys a `GEOMETRY` map by `mockupId` (`pouch-front-back`, `jar-front`, `box-isometric`, …). A generic "wrap onto the front" prompt mislabels multi-panel/angled/cylindrical packs, so each mockup ships an explicit instruction for which surface(s) to print and how the art should foreshorten. When adding a mockup, add its blank image to the build and a matching `GEOMETRY` entry.

**Front panel vs. compliance label are different artifacts.** `src/utils/frontPanelRenderer.js` canvas-renders a *clean brand-forward* panel (logo + name + tagline + net weight) — this is the "Image 2" fed to the mockup wrap, because dense labels wrap unrealistically. The full 3-column compliance label (`src/components/labels/*` templates, `labelCanvasRenderer.js`, `perspectiveWarper.js`) stays a separate print/download artifact. Don't conflate the two when editing.

**Frontend flow.** `src/App.jsx` is a 3-state switch (`landing → login → dashboard`) gated by a token in `localStorage` (`packco-token`); `api/login.js` is demo-grade auth only. `src/components/Dashboard.jsx` hosts the three studios (Label / Logo / Mockup) and is the largest component.

**Stage insurance.** `MockupStudio` falls back to pre-baked `/public/hero/<packageType>.jpg` if a live `/api/mockup` call fails — so a live pitch demo never visibly breaks. Regenerate these with `build-heroes.mjs` if the prompts or templates change.

## Git / auth note

This repo authenticates to GitHub as the **PackCoAI** account via a repo-local credential store (`.git/packco-credentials`), and its local `credential.helper` is deliberately reset so it bypasses the machine's global Git Credential Manager. Don't "fix" the remote by re-adding a token to the URL or changing the credential helper — that's what previously leaked PackCoAI logins into other projects. Commit identity is local-scoped to `menghoutishere`.
