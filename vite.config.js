import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  },
})
