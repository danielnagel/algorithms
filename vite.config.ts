import { resolve } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Algorithms',
      // the proper extensions will be added
      fileName: 'algorithms',
    },
  },
  plugins: [
    dtsPlugin({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.build.json'
    }),
  ],
})