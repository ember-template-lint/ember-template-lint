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
  });
});
