'use strict';

const stripIndent = require('common-tags').stripIndent;

const Linter = require('../../lib');

describe('recommended config', function () {
  function buildFakeConsole() {
    return {
      _logLines: [],

      log(data) {
        this._logLines.push(data);
      },
    };
  }

  let mockConsole;
  beforeEach(function () {
    mockConsole = buildFakeConsole();
  });

  function ensureValid(source) {
    it(`passes with: \`${source}\``, async function () {
      let config = { extends: 'recommended' };

      let linter = new Linter({
        console: mockConsole,
        config,
      });

      expect(await linter.verify({ source, moduleId: 'some/thing.hbs' })).toEqual([]);
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

  // This ensures that we don't face this issue again => https://github.com/ember-template-lint/ember-template-lint/issues/230
  ensureValid('<FooBar as |baz|><baz.Derp></baz.Derp></FooBar>');

  // This ensures that we don't face this issue again => https://github.com/ember-template-lint/ember-template-lint/issues/253
  ensureValid('<img alt="special thing" src={{some-dir/some-thing this.x}}>');

  // This ensures that we don't face this issue again => https://github.com/ember-template-lint/ember-template-lint/issues/443
  ensureValid(`
<PowerSelect
  @selected={{@pageSize}}
  @options={{this.availablePageSizes}}
  @searchEnabled={{false}}
  {{on 'change' this.changePageSize}} as |size|
>
  {{size}}
</PowerSelect>`);
});
