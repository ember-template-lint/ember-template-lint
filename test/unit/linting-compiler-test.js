'use strict';

const _precompile = require('@glimmer/compiler').precompile;

describe('template compiler', function() {
  let astPlugins;

  function precompile(template) {
    return _precompile(template, {
      rawSource: template,
      plugins: {
        ast: astPlugins
      }
    });
  }

  beforeEach(function() {
    astPlugins = [];
  });

  it('sanity: compiles templates', function() {
    let template = precompile('<div></div>');
    expect(template).toBeTruthy();
  });

  it('sanity: loads plugins on the template compiler', function() {
    let invocationCount = 0;
    function noopPlugin() {
      invocationCount++;

      return { name: 'fake', visitor: { } };
    }
    astPlugins.push(noopPlugin);
    precompile('<div></div>');

    expect(invocationCount).toEqual(1);
  });

  it('can access rawSource via options', function() {
    let options;
    function noopPlugin(env) {
      options = env;

      return {
        name: 'noop',

        visitor: {}
      };
    }

    astPlugins.push(noopPlugin);
    let expectedTemplate = '<div></div>';
    precompile(expectedTemplate);

    expect(options.rawSource).toEqual(expectedTemplate);
  });
});
