import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployment notes:
// - Vite reads VITE_* env vars at build time from .env or Vercel dashboard
// - The API URL is injected into import.meta.env.VITE_API_URL
// - For SPA routing on Vercel, see vercel.json rewrites config
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Dev proxy — not used in production
      // Production uses VITE_API_URL env var directly
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
