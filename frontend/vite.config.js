import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/compress': 'http://localhost:8000',
      '/decompress': 'http://localhost:8000'
    }
  }
})
