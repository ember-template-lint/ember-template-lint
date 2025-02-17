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
            "columnOffset": 18,
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
            "columnOffset": 23,
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
            "columnOffset": 27,
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

  // it("noop", () => {
  //   let t = new Transformer(simpleTest);
  //   let coords;

  //   t.transformOneSync(t.parseResults[0], (x, c) => {
  //     coords = c;
  //     return x;
  //   });

  //   expect(coords).toMatchInlineSnapshot(`
  //     {
  //       "column": 25,
  //       "columnOffset": 2,
  //       "end": 135,
  //       "line": 2,
  //       "start": 64,
  //     }
  //   `);
  //   expect(t.toString()).toMatchInlineSnapshot(`
  //     "test('it renders', async (assert) => {
  //       await render(<template>
  //         <div class="parent">
  //           <div class="child"></div>
  //         </div>
  //       </template>);
  //     });"
  //   `);
  // });

  // it("small replace", () => {
  //   let t = new Transformer(simpleTest);

  //   let coords;

  //   t.transformOneSync(t.parseResults[0], (_x, c) => {
  //     coords = c;
  //     return "x";
  //   });

  //   expect(coords).toMatchInlineSnapshot(`
  //     {
  //       "column": 25,
  //       "columnOffset": 2,
  //       "end": 135,
  //       "line": 2,
  //       "start": 64,
  //     }
  //   `);
  //   expect(t.toString()).toMatchInlineSnapshot(`
  //     "test('it renders', async (assert) => {
  //       await render(<template>x</template>);
  //     });"
  //   `);
  // });
});
