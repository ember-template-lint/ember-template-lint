'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'nested-interactive',

  config: true,

  good: [
    '<button>button</button>',
    '<button>button <strong>!!!</strong></button>',
    '<a><button>button</button></a>',
    '<a href="/">link</a>',
    '<a href="/">link <strong>!!!</strong></a>',
    '<button><input type="hidden"></button>',
    {
      config: {
        ignoredTags: ['button']
      },
      template: '<button><input></button>'
    },
    {
      config: {
        ignoreTabindex: true
      },

      template: '<button><div tabindex=-1></div></button>'
    },
    {
      config: {
        ignoreUsemapAttribute: true
      },

      template: '<button><img usemap=""></button>'
    }
  ],

  bad: [
    {
      template: '<a href="/">button<a href="/">!</a></a>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use an <a> element with the `href` attribute inside an <a> element with the `href` attribute',
        moduleId: 'layout.hbs',
        source: '<a href=\"/\">!</a>',
        line: 1,
        column: 18
      }
    },
    {
      template: '<a href="/">button<button>!</button></a>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <button> inside an <a> element with the `href` attribute',
        moduleId: 'layout.hbs',
        source: '<button>!</button>',
        line: 1,
        column: 18
      }
    },
    {
      template: '<button>button<a href="/">!</a></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use an <a> element with the `href` attribute inside <button>',
        moduleId: 'layout.hbs',
        source: '<a href=\"/\">!</a>',
        line: 1,
        column: 14
      }
    },
    {
      template: '<button>button<button>!</button></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <button> inside <button>',
        moduleId: 'layout.hbs',
        source: '<button>!</button>',
        line: 1,
        column: 14
      }
    },
    {
      template: '<button><input type="text"></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <input> inside <button>',
        moduleId: 'layout.hbs',
        source: '<input type="text">',
        line: 1,
        column: 8
      }
    },
    {
      template: '<button><details><summary>Some details</summary><p>!</p></details></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <details> inside <button>',
        moduleId: 'layout.hbs',
        source: '<details><summary>Some details</summary><p>!</p></details>',
        line: 1,
        column: 8
      }
    },
    {
      template: '<button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <embed> inside <button>',
        moduleId: 'layout.hbs',
        source: '<embed type=\"video/quicktime\" src=\"movie.mov\" width=\"640\" height=\"480\">',
        line: 1,
        column: 8
      }
    },
    {
      template: '<button><iframe src="/frame.html" width="640" height="480"></iframe></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <iframe> inside <button>',
        moduleId: 'layout.hbs',
        source: '<iframe src=\"/frame.html\" width=\"640\" height=\"480\"></iframe>',
        line: 1,
        column: 8
      }
    },
    {
      template: '<button><select></select></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <select> inside <button>',
        moduleId: 'layout.hbs',
        source: '<select></select>',
        line: 1,
        column: 8
      }
    },
    {
      template: '<button><textarea></textarea></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <textarea> inside <button>',
        moduleId: 'layout.hbs',
        source: '<textarea></textarea>',
        line: 1,
        column: 8
      }
    },
    {
      template: '<div tabindex="1"><button></button></div>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <button> inside an element with the `tabindex` attribute',
        moduleId: 'layout.hbs',
        source: '<button></button>',
        line: 1,
        column: 18
      }
    },
    {
      template: '<button><div tabindex="1"></div></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use an element with the `tabindex` attribute inside <button>',
        moduleId: 'layout.hbs',
        source: '<div tabindex=\"1\"></div>',
        line: 1,
        column: 8
      }
    },
    {
      template: '<button><img usemap=""></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use an <img> element with the `usemap` attribute inside <button>',
        moduleId: 'layout.hbs',
        source: '<img usemap=\"\">',
        line: 1,
        column: 8
      }
    },
    {
      template: '<object usemap=""><button></button></object>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <button> inside an <object> element with the `usemap` attribute',
        moduleId: 'layout.hbs',
        source: '<button></button>',
        line: 1,
        column: 18
      }
    },
    {
      config: {
        additionalInteractiveTags: ['my-special-input']
      },
      template: '<button><my-special-input></my-special-input></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <my-special-input> inside <button>',
        moduleId: 'layout.hbs',
        source: '<my-special-input></my-special-input>',
        line: 1,
        column: 8
      }
    }
  ]
});
