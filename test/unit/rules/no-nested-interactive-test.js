'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

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
      template: '<a href="/">button<a href="/">!</a></a>',

      result: {
        message:
          'Do not use an <a> element with the `href` attribute inside an <a> element with the `href` attribute',
        source: '<a href="/">!</a>',
        line: 1,
        column: 18,
      },
    },
    {
      template: '<a href="/">button<button>!</button></a>',

      result: {
        message: 'Do not use <button> inside an <a> element with the `href` attribute',
        source: '<button>!</button>',
        line: 1,
        column: 18,
      },
    },
    {
      template: '<button>button<a href="/">!</a></button>',

      result: {
        message: 'Do not use an <a> element with the `href` attribute inside <button>',
        source: '<a href="/">!</a>',
        line: 1,
        column: 14,
      },
    },
    {
      template: '<button>button<button>!</button></button>',

      result: {
        message: 'Do not use <button> inside <button>',
        source: '<button>!</button>',
        line: 1,
        column: 14,
      },
    },
    {
      template: '<button><input type="text"></button>',

      result: {
        message: 'Do not use <input> inside <button>',
        source: '<input type="text">',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><details><summary>Some details</summary><p>!</p></details></button>',

      result: {
        message: 'Do not use <summary> inside <button>',
        source: '<summary>Some details</summary>',
        line: 1,
        column: 17,
      },
    },
    {
      template:
        '<button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button>',

      result: {
        message: 'Do not use <embed> inside <button>',
        source: '<embed type="video/quicktime" src="movie.mov" width="640" height="480">',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><iframe src="/frame.html" width="640" height="480"></iframe></button>',

      result: {
        message: 'Do not use <iframe> inside <button>',
        source: '<iframe src="/frame.html" width="640" height="480"></iframe>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><select></select></button>',

      result: {
        message: 'Do not use <select> inside <button>',
        source: '<select></select>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><textarea></textarea></button>',

      result: {
        message: 'Do not use <textarea> inside <button>',
        source: '<textarea></textarea>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><div tabindex="1"></div></button>',

      result: {
        message: 'Do not use an element with the `tabindex` attribute inside <button>',
        source: '<div tabindex="1"></div>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><img usemap=""></button>',

      result: {
        message: 'Do not use an <img> element with the `usemap` attribute inside <button>',
        source: '<img usemap="">',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<object usemap=""><button></button></object>',

      result: {
        message: 'Do not use <button> inside an <object> element with the `usemap` attribute',
        source: '<button></button>',
        line: 1,
        column: 18,
      },
    },
    {
      config: {
        additionalInteractiveTags: ['my-special-input'],
      },
      template: '<button><my-special-input></my-special-input></button>',

      result: {
        message: 'Do not use <my-special-input> inside <button>',
        source: '<my-special-input></my-special-input>',
        line: 1,
        column: 8,
      },
    },

    {
      template: '<label><input><input></label>',

      result: {
        message: 'Do not use multiple interactive elements inside a single `<label>`',
        source: '<label><input><input></label>',
        line: 1,
        column: 14,
      },
    },

    {
      template: [
        '<label for="foo">',
        '  <div id="foo" tabindex=-1></div>',
        '  <input>',
        '</label>',
      ].join('\n'),

      result: {
        message: 'Do not use multiple interactive elements inside a single `<label>`',
        source: '<label for="foo">\n  <div id="foo" tabindex=-1></div>\n  <input>\n</label>',
        line: 3,
        column: 2,
      },
    },
  ],
});
