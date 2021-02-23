const { createEnv } = require('yeoman-environment');

// eslint-disable-next-line wrap-iife
(async function () {
  let env = createEnv();

  env.register(require.resolve('./new-rule-generator'), 'ember-template-lint:new-rule');

  await env.run('ember-template-lint:new-rule');
})();
