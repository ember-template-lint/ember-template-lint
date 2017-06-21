'use strict';

const expect = require('chai').expect;
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
    expect(template).to.be.ok;
  });

  it('sanity: loads plugins on the template compiler', function() {
    let invokeCount = 0;
    function noopPlugin() {
      invokeCount++;

      return {
        name: 'noop',
        visitors: {}
      };
    }

    astPlugins.push(noopPlugin);
    precompile('<div></div>');

    expect(invokeCount).to.equal(1);
  });

  it('can access rawSource via options', function() {
    let options;
    function noopPlugin(env) {
      options = env;

      return {
        name: 'noop',
        visitors: {}
      };
    }

    astPlugins.push(noopPlugin);
    let expectedTemplate = '<div></div>';
    precompile(expectedTemplate);

    expect(options.rawSource).to.equal(expectedTemplate);
  });
});
