# DocMind AI — App

Mobile + web frontend for **DocMind AI**, an AI-powered document text analysis app. Paste or upload text, get AI summaries, simple explanations, and key insights — powered by the [docmind-ai-backend](../) API and Google Gemini.

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
- The backend running (see `docmind-ai-backend` README) — or point the app at the deployed API URL

### Installation

```bash
npm install
npx expo start
```

Then open it in [Expo Go](https://expo.dev/go), an Android emulator, iOS simulator, or press `w` for the web version.

### Configuration

The backend URL comes from the `EXPO_PUBLIC_API_URL` environment variable (see `src/config.ts`). Create a `.env` file in the project root to override the local default:

```
EXPO_PUBLIC_API_URL=https://your-backend.onrender.com
```

Without it, the app talks to `http://127.0.0.1:5000` (local backend).

## 📁 Project Structure

```
src/
  app/            # expo-router screens (index, signup, home, explore)
  components/     # reusable UI components
  config.ts       # backend API URL
  constants/      # theme constants
  hooks/          # theme / color-scheme hooks
assets/           # icons, splash, images
```

## 📄 License

MIT — see [LICENSE](LICENSE).
