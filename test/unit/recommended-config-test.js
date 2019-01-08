'use strict';

const Linter = require('../../lib/index');
const expect = require('chai').expect;
const stripIndent = require('common-tags').stripIndent;

describe('recommended config', function() {
  function buildFakeConsole() {
    return {
      _logLines: [],

      log(data) {
        this._logLines.push(data);
      }
    };
  }

  let mockConsole;
  beforeEach(function() {
    mockConsole = buildFakeConsole();
  });

  function ensureValid(source) {
    it(`passes with: \`${source}\``, function() {
      let config = { extends: 'recommended' };

      let linter = new Linter({
        console: mockConsole,
        config: config
      });

      expect(linter.verify({ source, moduleId: 'some/thing.hbs' })).to.deep.equal([]);
    });
  }


  ensureValid(stripIndent`
    <md-autocomplete-wrap
      id={{this.autocompleteWrapperId}}
      role="listbox"
      layout="row"
      class="{{if this.notFloating "md-whiteframe-z1"}} {{if this.notHidden "md-menu-showing"}}"
    >
    </md-autocomplete-wrap>
  `);

  // This ensures that we don't face this issue again => https://github.com/rwjblue/ember-template-lint/issues/230
  ensureValid('{{#foo-bar as |baz|}}{{#baz.derp}}{{/baz.derp}}{{/foo-bar}}');

  // This ensures that we don't face this issue again => https://github.com/rwjblue/ember-template-lint/issues/253
  ensureValid('<img alt="special thing" src={{some-dir/some-thing this.x}}>');

  // This ensures that we don't face this issue again => https://github.com/rwjblue/ember-template-lint/issues/443
  ensureValid(`
<PowerSelect
  @selected={{@pageSize}}
  @options={{this.availablePageSizes}}
  @searchEnabled={{false}}
  @onchange={{action this.changePageSize}} as |size|
>
  {{size}}
</PowerSelect>`);
});
