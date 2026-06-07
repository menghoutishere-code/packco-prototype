import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { devApiPlugin } from './scripts/vite-dev-api.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env so the dev api handlers can read GEMINI_API_KEY via process.env.
  const env = loadEnv(mode, process.cwd(), '')
  for (const k of ['GEMINI_API_KEY', 'GEMINI_IMAGE_MODEL']) {
    if (env[k]) process.env[k] = env[k]
  }

  return {
    plugins: [react(), devApiPlugin()],
  }
})
