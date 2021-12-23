import { fileURLToPath } from 'node:url';
import yeomanEnvironment from 'yeoman-environment';

const { createEnv } = yeomanEnvironment;

const AVAILABLE_GENERATORS = ['new-rule'];

async function main() {
  let generatorName = process.argv.slice(2);
  let env = createEnv();

  for (const generator of AVAILABLE_GENERATORS) {
    env.register(
      fileURLToPath(new URL(`./${generator}-generator.js`, import.meta.url)),
      `ember-template-lint:${generator}`
    );
  }

  await env.run(`ember-template-lint:${generatorName}`);
}

main();
