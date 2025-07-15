import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Add this for Vercel deployment
  build: {
    outDir: 'dist', // Ensure this matches Vercel's expected output
  },
})