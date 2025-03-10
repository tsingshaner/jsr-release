///<reference types="vitest" />
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkgJSON from './package.json' with { type: 'json' }

const ROOT = import.meta.dirname

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(ROOT, 'src/index.ts')
      },
      formats: ['es']
    },
    minify: false,
    rollupOptions: {
      external: Object.keys((pkgJSON as { dependencies?: Record<string, string> }).dependencies ?? {})
    }
  },
  plugins: [
    dts({
      copyDtsFiles: true,
      rollupTypes: true,
      tsconfigPath: resolve(ROOT, '.config/tsconfig.app.json')
    })
  ],
  resolve: {
    alias: {
      '@': resolve(ROOT, 'src')
    }
  },
  test: {
    coverage: {
      all: true,
      include: ['src/']
    },
    root: ROOT
  }
})
