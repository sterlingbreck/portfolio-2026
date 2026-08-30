import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), ViteImageOptimizer({
    png: {
      quality: 80,
    },
    jpeg: {
      quality: 85,
    },
    jpg: {
      quality: 85,
    },
    webp: {
      quality: 85,
    },
  }), cloudflare()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // contact form API served by `npm run worker:dev` during local dev
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})