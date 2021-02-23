const { createEnv } = require('yeoman-environment');

async function main() {
  let env = createEnv();

  env.register(require.resolve('./new-rule-generator'), 'ember-template-lint:new-rule');

  await env.run('ember-template-lint:new-rule');
}

main();
