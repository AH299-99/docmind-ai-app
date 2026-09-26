# DocMind AI — App

[![CI](https://github.com/AH299-99/docmind-ai-app/actions/workflows/ci.yml/badge.svg)](https://github.com/AH299-99/docmind-ai-app/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Mobile + web frontend for **DocMind AI**. Paste any text and get AI summaries, simple explanations, and key insights — powered by the [docmind-ai-backend](https://github.com/AH299-99/docmind-ai-backend) API and Google Gemini.

## ✨ Features

- 📝 Submit text for AI analysis — **summarize**, **explain**, or **analyze**
- 🔐 Signup / login with JWT session persisted on-device
- 📱 Cross-platform: Android, iOS, and Web from one codebase
- 🎨 Themed UI with dark-mode support

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev) (React Native + TypeScript)
- **Routing:** expo-router (file-based)
- **HTTP:** axios
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
| Home (Analyzer)   | `src/app/home.tsx`   | Pick a task, paste text, see the AI result        |
| Explore           | `src/app/explore.tsx`| In-app help with links to Expo docs               |

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
