/// <reference types="vitest/config" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// Two modes:
//  - default: builds the demo site (index.html) for deployment / `npm run dev`
//  - lib:     builds the embeddable <TicTacNora /> component as a library
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      react(),
      ...(isLib
        ? [dts({ include: ['src/index.ts', 'src/components', 'src/game'], rollupTypes: true })]
        : []),
    ],
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'TicTacNora',
            fileName: 'tic-tac-nora',
            formats: ['es'],
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
        }
      : {},
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  }
})
