// Vite settings: how `npm run dev` / `npm run build` work, plus the vitest test setup (`npx vitest run`).
// the react plugin handles JSX. tests run in a fake browser (jsdom) with setup from src/test/setup.js.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
