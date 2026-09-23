// Backend API base URL.
// Set EXPO_PUBLIC_API_URL in your environment (or a .env file) when the
// backend isn't on this machine — e.g. your deployed Render URL.
// Falls back to local dev so existing setups keep working.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:5000';
