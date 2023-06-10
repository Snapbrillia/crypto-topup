const { nodeResolve } = require('@rollup/plugin-node-resolve');
const external = require('rollup-plugin-peer-deps-external');
const nodePolyfills = require('rollup-plugin-polyfill-node');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');
const image = require('@rollup/plugin-image');
const json = require('@rollup/plugin-json');
const url = require('@rollup/plugin-url');
const replace = require('@rollup/plugin-replace');
const alias = require('rollup-plugin-alias');

const path = require('path');
const pkg = require('./package.json');

module.exports = [
  {
    input: './src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        sourcemap: true,
        file: pkg.module,
        format: 'es',
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      external(),
      nodePolyfills(),
      commonjs({}),
      nodeResolve({
        exportConditions: ['default', 'module', 'import'],
        mainFields: ['browser', 'module', 'main'],
        extensions: ['.mjs', '.js', '.json', '.node', '.jsx', '.ts', '.tsx'],
        modulesOnly: true,
        // preferBuiltins: false
      }),
      babel({
        babelrc: false,
        exclude: './node_modules/**',
        presets: [
          '@babel/preset-env',
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
        ],
        babelHelpers: 'bundled',
      }),
      postcss({
        extensions: ['.css'],
      }),
      url(),
      image(),
      json(),
      terser(),
    ],
  }
];
