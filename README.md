# DocMind AI — App

[![CI](https://github.com/AH299-99/docmind-ai-app/actions/workflows/ci.yml/badge.svg)](https://github.com/AH299-99/docmind-ai-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Mobile + web frontend for **DocMind AI**. Paste any text and get AI summaries, simple explanations, and key insights — powered by the [docmind-ai-backend](https://github.com/AH299-99/docmind-ai-backend) API and Google Gemini.

## ✨ Features

- 📝 **Text mode** — paste any text and get AI summaries, simple explanations, or key insights
- 📄 **Document mode** — pick a PDF, DOCX, or TXT file (up to 10 MB) and upload it for analysis
- 🎓 **Assignment mode** — type a topic, pick a level (School / College / University) and length (Short / Medium / Long), add optional instructions, and get a full assignment written for you
- ⬇️ **Download results** — save any result as PDF, Word, or TXT (opens the phone's share sheet, or downloads directly on web)
- 🌈 Colourful gradient header with per-task chip colours — fast, no heavy animations
- 🔐 Signup / login with JWT session persisted on-device
- 📱 Cross-platform: Android, iOS, and Web from one codebase
- 🎨 Themed UI with dark-mode support

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev) (React Native + TypeScript)
- **Routing:** expo-router (file-based)
- **HTTP:** axios
- **Native modules:** expo-document-picker, expo-file-system, expo-sharing, expo-linear-gradient
- **Backend:** [docmind-ai-backend](https://github.com/AH299-99/docmind-ai-backend) (Express + MongoDB + Gemini)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- The backend running (see the [backend README](https://github.com/AH299-99/docmind-ai-backend)) — or point the app at the deployed API URL

### Installation

```bash
npm install
npx expo start
```

Then open it in [Expo Go](https://expo.dev/go), an Android emulator, iOS simulator, or press `w` for the web version.

### Configuration

The backend URL comes from the `EXPO_PUBLIC_API_URL` environment variable (see `src/config.ts`). Create a `.env` file in the project root to override the local default (restart `expo start` afterwards so it picks it up):

```
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com
```

Without it, the app talks to `http://127.0.0.1:5000` (local backend). Tip: on an Android emulator, `127.0.0.1` is the emulator itself — use `http://10.0.2.2:5000` to reach a backend running on your machine.

| Variable              | Required | Description                                        |
| --------------------- | -------- | -------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | No       | Backend API base URL (default `http://127.0.0.1:5000`) |

## 📱 Screens

| Screen            | File                 | What it does                                      |
| ----------------- | -------------------- | ------------------------------------------------- |
| Login             | `src/app/index.tsx`  | Email + password login, stores the JWT on-device  |
| Signup            | `src/app/signup.tsx` | Creates a new account                             |
| Home (Analyzer)   | `src/app/home.tsx`   | Three modes: Text (paste + analyze), Document (upload a PDF/DOCX/TXT), Assignment (topic → full assignment); download results as PDF / Word / TXT |
| Help              | `src/app/help.tsx`   | How-to guide: modes, downloads, privacy, troubleshooting |

## How the three Home modes work

- **Text** — paste text, tap a task chip (Summarize / Explain / Analyze), tap *Analyze*. Sends `POST /api/ai/analyze` with `{ text, task }`.
- **Document** — tap *Pick document* (PDF, DOCX, or TXT, up to 10 MB), pick a task chip, tap *Upload & Analyze*. Sends a multipart `POST /api/ai/upload` with the file as `document` and the `task`.
- **Assignment** — type a topic, choose a level (School / College / University) and length (Short / Medium / Long), optionally add instructions, tap *Generate Assignment*. Sends `POST /api/ai/assignment` with `{ topic, instructions?, level, length }` and shows the returned title + result.

Every result card has **PDF**, **Word**, and **TXT** buttons. Each sends `POST /api/ai/export` with `{ title, content, format }`, then on phones saves the file and opens the share sheet (via expo-file-system + expo-sharing), while on web it downloads the file straight to your computer. All endpoints use the same JWT Bearer token as login.

## 📁 Project Structure

```
src/
  app/            # expo-router screens (index, signup, home, explore)
  components/     # reusable UI components
  config.ts       # backend API URL (reads EXPO_PUBLIC_API_URL)
  constants/      # theme constants
  hooks/          # theme / color-scheme hooks
assets/           # icons, splash, images
```

## 🧪 Type check

```bash
npx tsc --noEmit   # also runs automatically on every push via GitHub Actions
```

## 📄 License

MIT © 2026 Azmat Hayat — see [LICENSE](LICENSE).
