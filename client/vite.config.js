import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['tailwindcss/version.js']
  },
  resolve: {
    alias: {
      'tailwindcss/version.js': 'tailwindcss/package.json'
    }
  }
})