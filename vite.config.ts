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
})
