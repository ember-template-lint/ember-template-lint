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
      config: ['button', 'details', 'embed', 'iframe', 'img', 'input', 'object', 'select', 'tabindex', 'textarea'],
      template: '<a href="/">button<a href="/">!</a></a>'
    }, {
      config: ['a', 'details', 'embed', 'iframe', 'img', 'input', 'object', 'select', 'tabindex', 'textarea'],
      template: '<a href="/">button<button>!</button></a>'
    }, {
      config: ['a', 'details', 'embed', 'iframe', 'img', 'input', 'object', 'select', 'tabindex', 'textarea'],
      template: '<button>button<button>!</button></button>'
    }, {
      config: ['a', 'button', 'details', 'embed', 'iframe', 'img', 'object', 'select', 'tabindex', 'textarea'],
      template: '<button><input type="text"></button>'
    }, {
      config: ['a', 'button', 'embed', 'iframe', 'img', 'input', 'object', 'select', 'tabindex', 'textarea'],
      template: '<button><details><summary>Some details</summary><p>!</p></details></button>'
    }, {
      config: ['a', 'button', 'details', 'iframe', 'img', 'input', 'object', 'select', 'tabindex', 'textarea'],
      template: '<button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button>'
    }, {
      config: ['a', 'button', 'details', 'embed', 'img', 'input', 'object', 'select', 'tabindex', 'textarea'],
      template: '<button><iframe src="/frame.html" width="640" height="480"></iframe></button>'
    }, {
      config: ['a', 'button', 'details', 'embed', 'iframe', 'img', 'input', 'object', 'tabindex', 'textarea'],
      template: '<button><select></select></button>'
    }, {
      config: ['a', 'button', 'details', 'embed', 'iframe', 'img', 'input', 'object', 'select', 'tabindex'],
      template: '<button><textarea></textarea></button>'
    }, {
      config: ['a', 'button', 'details', 'embed', 'iframe', 'img', 'input', 'object', 'select', 'textarea'],
      template: '<div tabindex="1"><button></button></div>'
    }, {
      config: ['a', 'button', 'details', 'embed', 'iframe', 'input', 'object', 'select', 'tabindex', 'textarea'],
      template: '<button><img usemap=""></button>'
    }, {
      config: ['a', 'button', 'details', 'embed', 'iframe', 'img', 'input', 'select', 'tabindex', 'textarea'],
      template: '<object usemap=""><button></button></object>'
    }
  ],

  bad: [
    {
      config: ['a'],
      template: '<a href="/">button<a href="/">!</a></a>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <a> inside <a>',
        moduleId: 'layout.hbs',
        source: '<a href=\"/\">!</a>',
        line: 1,
        column: 18
      }
    },
    {
      config: ['a', 'button'],
      template: '<a href="/">button<button>!</button></a>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <button> inside <a>',
        moduleId: 'layout.hbs',
        source: '<button>!</button>',
        line: 1,
        column: 18
      }
    },
    {
      config: ['a', 'button'],
      template: '<button>button<a href="/">!</a></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <a> inside <button>',
        moduleId: 'layout.hbs',
        source: '<a href=\"/\">!</a>',
        line: 1,
        column: 14
      }
    },
    {
      config: ['button'],
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
      config: ['button', 'input'],
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
      config: ['button', 'details'],
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
      config: ['button', 'embed'],
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
      config: ['button', 'iframe'],
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
      config: ['button', 'select'],
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
      config: ['button', 'textarea'],
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
      config: ['button', 'tabindex'],
      template: '<div tabindex="1"><button></button></div>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <button> inside an element with attribute `tabindex`',
        moduleId: 'layout.hbs',
        source: '<button></button>',
        line: 1,
        column: 18
      }
    },
    {
      config: ['button', 'tabindex'],
      template: '<button><div tabindex="1"></div></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use an element with attribute `tabindex` inside <button>',
        moduleId: 'layout.hbs',
        source: '<div tabindex=\"1\"></div>',
        line: 1,
        column: 8
      }
    },
    {
      config: ['button', 'img'],
      template: '<button><img usemap=""></button>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use an element with attribute `usemap` inside <button>',
        moduleId: 'layout.hbs',
        source: '<img usemap=\"\">',
        line: 1,
        column: 8
      }
    },
    {
      config: ['button', 'object'],
      template: '<object usemap=""><button></button></object>',

      result: {
        rule: 'nested-interactive',
        message: 'Do not use <button> inside an element with attribute `usemap`',
        moduleId: 'layout.hbs',
        source: '<button></button>',
        line: 1,
        column: 18
      }
    }
  ]
});
