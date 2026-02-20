import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
  optimizeDeps: {
    exclude: ['sharp'], // 👈 importante
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: 'src/main/index.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['sharp'], // 👈 MUY importante
            },
          },
        },
      },
      preload: {
        entry: 'src/main/preload.ts',
      },
    }),
  ],
})
