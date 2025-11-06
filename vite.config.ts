import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  css: {
    preprocessorOptions: {
      scss: {
        // Remove additionalData to avoid circular imports
      },
    },
  },
  server: {
    proxy: {
      '/api': 'https://unifiedadminbackend-tex0.onrender.com', // Change 3001 to your backend port if different
    },
  },
})
