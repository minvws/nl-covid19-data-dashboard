// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import autoExternal from 'rollup-plugin-auto-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    visualizer(),
    autoExternal(),
    nodeResolve({ preferBuiltins: false }),
    commonjs({
      /**
       * Rollup fails to understand some named imports when converting to
       * commonjs. I don't quite understand why that is, but this seems to solve
       * it.
       */
      namedExports: { 'ts-is-present': ['isFilled'] },
    }),
    typescript(),
    typescriptPaths(),
  ],
};
