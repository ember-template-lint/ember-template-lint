import { templateInfoForScript } from '../../lib/template-info.js';

const simpleTest = [
  "test('it renders', async (assert) => {",
  '  await render(hbs`',
  '    <div class="parent">',
  '      <div class="child"></div>',
  '    </div>',
  '  `);',
  '});',
].join('\n');

const returnTest = [
  'hooks.beforeEach(function() {',
  '  this.renderTemplate = () => {',
  '    return render(hbs`',
  '      <div class="parent">',
  '        <div class="child"></div>',
  '      </div>',
  '    `);',
  '  };',
  '});',
].join('\n');

const multiTemplate = [
  'export const Name = hbs`',
  '  {{@name}}',
  '`;',
  '',
  'export const Greeting = hbs`',
  '  Hello, <Name @name={{@name}} />!',
  '`;',
  '',
].join('\n');

describe('template-info', () => {
  describe('templateInfoForScript', () => {
    it('simple', () => {
      expect(templateInfoForScript(simpleTest)).toMatchInlineSnapshot(`
        [
          {
            "column": 19,
            "columnOffset": 2,
            "end": 129,
            "isEmbedded": true,
            "isStrictMode": false,
            "line": 2,
            "start": 58,
            "template": "
            <div class="parent">
              <div class="child"></div>
            </div>
          ",
          },
        ]
      `);
    });

    it('return', () => {
      expect(templateInfoForScript(returnTest)).toMatchInlineSnapshot(`
        [
          {
            "column": 22,
            "columnOffset": 4,
            "end": 163,
            "isEmbedded": true,
            "isStrictMode": false,
            "line": 3,
            "start": 84,
            "template": "
              <div class="parent">
                <div class="child"></div>
              </div>
            ",
          },
        ]
      `);
    });

    it('multi', () => {
      expect(templateInfoForScript(multiTemplate)).toMatchInlineSnapshot(`
        [
          {
            "column": 24,
            "columnOffset": 0,
            "end": 37,
            "isEmbedded": true,
            "isStrictMode": false,
            "line": 1,
            "start": 24,
            "template": "
          {{@name}}
        ",
          },
          {
            "column": 28,
            "columnOffset": 0,
            "end": 105,
            "isEmbedded": true,
            "isStrictMode": false,
            "line": 5,
            "start": 69,
            "template": "
          Hello, <Name @name={{@name}} />!
        ",
          },
        ]
      `);
    });

    it('supports decorators in the source file', () => {
      // Example code taken from this issue: https://github.com/ember-template-lint/ember-template-lint/issues/3142
      const source = `import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { tracked } from '@glimmer/tracking';
import { setOwner } from '@ember/owner';
import type Owner from '@ember/owner';

interface Context extends TestContext {
  element: HTMLElement;
  model: Model;
}

class Model {
  constructor(owner: Owner) {
    setOwner(this, owner);
  }

  @tracked emailAddress = '';
}

module('Integration | Component | my-component', function (hooks) {
  setupRenderingTest(hooks);

  test<Context>('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const model = new Model(this.owner);

    this.model = model;

    await render<Context>(hbs\`{{this.model.emailAddress}}\`);

    assert.notEqual(this.element?.textContent, '');
  });
});
`;

      expect(templateInfoForScript(source)).toMatchInlineSnapshot(`
        [
          {
            "column": 30,
            "columnOffset": 4,
            "end": 931,
            "isEmbedded": true,
            "isStrictMode": false,
            "line": 33,
            "start": 904,
            "template": "{{this.model.emailAddress}}",
          },
        ]
      `);
    });
  });
});
