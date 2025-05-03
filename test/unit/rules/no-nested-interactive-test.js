import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-nested-interactive',

  config: true,

  good: [
    '<button>button</button>',
    '<button>button <strong>!!!</strong></button>',
    '<a><button>button</button></a>',
    '<a href="/">link</a>',
    '<a href="/">link <strong>!!!</strong></a>',
    '<button><input type="hidden"></button>',
    '<div tabindex=-1><button>Click me!</button></div>',
    '<div tabindex="1"><button></button></div>',
    '<label><input></label>',
    `
    <ul role="menubar" aria-label="functions" id="appmenu">
      <li role="menuitem" aria-haspopup="true">
        File
        <ul role="menu">
          <li role="menuitem">New</li>
          <li role="menuitem">Open</li>
          <li role="menuitem">Print</li>
        </ul>
      </li>
    </ul>
    `,
    `
  <label> My input:
    {{#if @select}}
      <select></select>
    {{else}}
      <input type='text'>
    {{/if}}
  </label>
    `,
    `
  <label> My input:
    {{#if @select}}
      {{#if @multiple}}
        <select multiple></select>
      {{else}}
        <select></select>
      {{/if}}
    {{else}}
      <input type='text'>
    {{/if}}
  </label>
    `,
    {
      config: {
        ignoredTags: ['button'],
      },
      template: '<button><input></button>',
    },
    {
      config: {
        ignoreTabindex: true,
      },

      template: '<button><div tabindex=-1></div></button>',
    },
    {
      config: {
        ignoreUsemapAttribute: true,
      },

      template: '<button><img usemap=""></button>',
    },
  ],

  bad: [
    {
      template: '<summary><a href="/">button</a></summary>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use an <a> element with the \`href\` attribute inside <summary>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<a href="/">button</a>",
            },
          ]
        `);
      },
    },
    {
      template: '<a href="/">button<a href="/">!</a></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use an <a> element with the \`href\` attribute inside an <a> element with the \`href\` attribute",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<a href="/">!</a>",
            },
          ]
        `);
      },
    },
    {
      template: '<a href="/">button<button>!</button></a>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 36,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <button> inside an <a> element with the \`href\` attribute",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<button>!</button>",
            },
          ]
        `);
      },
    },
    {
      template: '<button>button<a href="/">!</a></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use an <a> element with the \`href\` attribute inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<a href="/">!</a>",
            },
          ]
        `);
      },
    },
    {
      template: '<button>button<button>!</button></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <button> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<button>!</button>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><input type="text"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <input> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<input type="text">",
            },
          ]
        `);
      },
    },
    {
      template: '<button><details><p>!</p></details></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <details> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<details><p>!</p></details>",
            },
          ]
        `);
      },
    },
    {
      template:
        '<button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 79,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <embed> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<embed type="video/quicktime" src="movie.mov" width="640" height="480">",
            },
          ]
        `);
      },
    },
    {
      template: '<button><iframe src="/frame.html" width="640" height="480"></iframe></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 68,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <iframe> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<iframe src="/frame.html" width="640" height="480"></iframe>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><select></select></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <select> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<select></select>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><textarea></textarea></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 29,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <textarea> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<textarea></textarea>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><div tabindex="1"></div></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use an element with the \`tabindex\` attribute inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<div tabindex="1"></div>",
            },
          ]
        `);
      },
    },
    {
      template: '<button><img usemap=""></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use an <img> element with the \`usemap\` attribute inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<img usemap="">",
            },
          ]
        `);
      },
    },
    {
      template: '<object usemap=""><button></button></object>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 18,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <button> inside an <object> element with the \`usemap\` attribute",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<button></button>",
            },
          ]
        `);
      },
    },
    {
      config: {
        additionalInteractiveTags: ['my-special-input'],
      },
      template: '<button><my-special-input></my-special-input></button>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use <my-special-input> inside <button>",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<my-special-input></my-special-input>",
            },
          ]
        `);
      },
    },

    {
      template: '<label><input><input></label>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 14,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Do not use multiple interactive elements inside a single \`<label>\`",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<label><input><input></label>",
            },
          ]
        `);
      },
    },

    {
      template: [
        '<label for="foo">',
        '  <div id="foo" tabindex=-1></div>',
        '  <input>',
        '</label>',
      ].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 2,
              "endColumn": 9,
              "endLine": 3,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Do not use multiple interactive elements inside a single \`<label>\`",
              "rule": "no-nested-interactive",
              "severity": 2,
              "source": "<label for="foo">
            <div id="foo" tabindex=-1></div>
            <input>
          </label>",
            },
          ]
        `);
      },
    },
  ],
});
