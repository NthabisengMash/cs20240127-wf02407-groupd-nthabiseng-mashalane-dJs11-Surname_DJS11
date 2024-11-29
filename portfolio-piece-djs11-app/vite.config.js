import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure your app works correctly if deployed to root (default for Netlify)
  build: {
    outDir: 'dist', // Ensure the build output directory is set to 'dist'
  },
})
