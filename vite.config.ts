import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  root: 'public',
  resolve: {
    alias: {
      '/@src/': path.resolve(import.meta.dirname, 'src') + '/',
    },
  },
})
