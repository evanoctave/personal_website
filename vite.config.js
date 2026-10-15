// Vite settings: how `npm run dev` / `npm run build` work, plus the vitest test setup (`npx vitest run`).
// the react plugin handles JSX. tests run in a fake browser (jsdom) with setup from src/test/setup.js.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // the dice gate's three.js chunk (src/components/dice/scene.js) is ~600 kB and loads lazily on /home only;
  // raise the warning bar so `npm run build` stays quiet about it
  build: { chunkSizeWarningLimit: 700 },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
