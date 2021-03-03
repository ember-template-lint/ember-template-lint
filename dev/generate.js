const { createEnv } = require('yeoman-environment');

const AVAILABLE_GENERATORS = ['new-rule', 'rules-index'];

async function main() {
  let generator = process.argv.slice(2);
  let env = createEnv();

  for (const generator of AVAILABLE_GENERATORS) {
    env.register(require.resolve(`./${generator}-generator`), `ember-template-lint:${generator}`);
  }

  await env.run(`ember-template-lint:${generator}`);
}

main();
