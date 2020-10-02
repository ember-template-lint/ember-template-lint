'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = 'Do not nest interactive elements';

generateRuleTests({
  name: 'no-nested-interactive',

  config: true,

  good: [
    '<button>button</button>',
    '<button>button <strong>!!!</strong></button>',
    '<a href="/">link</a>',
    '<a href="/">link <strong>!!!</strong></a>',
    '<button><input type="hidden"></button>',
    '<label><input></label>',
    {
      config: {
        ignoredTags: ['button'],
      },
      template: '<button><input></button>',
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
        message: ERROR_MESSAGE,
        source: '<a href="/">!</a>',
        line: 1,
        column: 18,
      },
    },
    {
      template: '<a href="/">button<button>!</button></a>',

      result: {
        message: ERROR_MESSAGE,
        source: '<button>!</button>',
        line: 1,
        column: 18,
      },
    },
    {
      template: '<button>button<a href="/">!</a></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<a href="/">!</a>',
        line: 1,
        column: 14,
      },
    },
    {
      template: '<button>button<button>!</button></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<button>!</button>',
        line: 1,
        column: 14,
      },
    },
    {
      template: '<button><input type="text"></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<input type="text">',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><details><summary>Some details</summary><p>!</p></details></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<details><summary>Some details</summary><p>!</p></details>',
        line: 1,
        column: 8,
      },
    },
    {
      template:
        '<button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<embed type="video/quicktime" src="movie.mov" width="640" height="480">',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><iframe src="/frame.html" width="640" height="480"></iframe></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<iframe src="/frame.html" width="640" height="480"></iframe>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><select></select></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<select></select>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><textarea></textarea></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<textarea></textarea>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><div tabindex="0" role="button"></div></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<div tabindex="0" role="button"></div>',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<button><img usemap=""></button>',

      result: {
        message: ERROR_MESSAGE,
        source: '<img usemap="">',
        line: 1,
        column: 8,
      },
    },
    {
      template: '<object usemap=""><button></button></object>',

      result: {
        message: ERROR_MESSAGE,
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
        message: ERROR_MESSAGE,
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
      template: '<label for="foo"><div id="foo" tabindex=0 role="button"></div><input></label>',

      result: {
        message: 'Do not use multiple interactive elements inside a single `<label>`',
        source: '<label for="foo"><div id="foo" tabindex=0 role="button"></div><input></label>',
        line: 1,
        column: 62,
      },
    },
  ],
});
