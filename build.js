import esbuild from 'esbuild';

const externalDeps = [
  '@lint-todo/utils', // Dynamic require of "node:path" is not supported
  'content-tag', //  Dynamic require of "node:util" is not supported
  // 'aria-query', -> safe to bundle
  // 'date-fns', -> safe to bundle
  // 'get-stdin', -> safe to bundle
  // 'fuse.js', -> safe to bundle
  // 'find-up', -> safe to bundle
  // 'is-glob', -> safe to bundle
  // 'chalk', -> safe to bundle
  // 'ci-info', -> safe to bundle
  // 'content-tag-utils', -> safe to bundle
  // 'ember-template-recast', -> safe to bundle
  // 'eslint-formatter-kakoune', -> safe to bundle
  // '@babel/generator', -> safe to bundle
  // '@babel/parser', -> safe to bundle
  // '@babel/plugin-syntax-typescript',  -> safe to bundle
  // '@babel/plugin-transform-typescript',  -> safe to bundle
  // 'yargs', -> safe to bundle
  'v8-compile-cache', // Dynamic require of "node:module" is not supported
  'micromatch', // Dynamic require of "node:util" is not supported
  'globby', // Dynamic require of "node:os" is not supported
  '@babel/traverse', // Dynamic require of "tty" is not supported
  'resolve', // Dynamic require of "node:fs" is not supported
  // node built-ins
  'node:vm',
  'node:path',
  'node:fs',
  'node:url',
  'node:process',
  'node:util',
  'node:module',
  'node:worker_threads',
  'node:os',
  'node:assert',
  'node:constants',
  'node:crypto',
  'node:events',
  'node:stream',
];

const aliases = {
  path: 'node:path',
  util: 'node:util',
  fs: 'node:fs',
  stream: 'node:stream',
  os: 'node:os',
  assert: 'node:assert',
  constants: 'node:constants',
  vm: 'node:vm',
  crypto: 'node:crypto',
  module: 'node:module',
  url: 'node:url',
};

await esbuild.build({
  entryPoints: ['bin/source-ember-template-lint.js'],
  outfile: 'bin/ember-template-lint.js',
  bundle: true,
  sourcemap: false,
  platform: 'node',
  minify: true,
  treeShaking: true,
  splitting: false,
  format: 'esm',
  target: ['node18'],
  alias: aliases,
  external: externalDeps,
});

await esbuild.build({
  entryPoints: ['lib/index.js'],
  outfile: 'dist/index.js',
  bundle: true,
  sourcemap: false,
  platform: 'node',
  minify: true,
  treeShaking: true,
  splitting: false,
  format: 'esm',
  target: ['node18'],
  alias: aliases,
  external: externalDeps,
});
