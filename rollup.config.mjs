import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import css from 'rollup-plugin-import-css';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/anki-mt.bundle.js',
      format: 'umd',
      name: 'AnkiMoveTrainer', // window.AnkiMoveTrainer.init(...)
      sourcemap: false,
    },
  ],
  external: [],
  plugins: [
    resolve({ browser: true }),
    commonjs(), // convert CJS to ESM
    url({
      include: ['**/*.png'],
      limit: Infinity, // inline all matched images
    }),
    css({ output: 'anki-mt.css' }), // still emit CSS; keep or remove as you prefer
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};
