'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'self-closing-void-elements',

  config: true,

  good: [
    '<area>',
    '<base>',
    '<br>',
    '<col>',
    '<command>',
    '<embed>',
    '<hr>',
    '<img>',
    '<input>',
    '<keygen>',
    '<link>',
    '<meta>',
    '<param>',
    '<source>',
    '<track>',
    '<wbr>',
    {
      config: 'require',
      template: '<area/>',
    },
    {
      config: 'require',
      template: '<base/>',
    },
    {
      config: 'require',
      template: '<br/>',
    },
    {
      config: 'require',
      template: '<col/>',
    },
    {
      config: 'require',
      template: '<command/>',
    },
    {
      config: 'require',
      template: '<embed/>',
    },
    {
      config: 'require',
      template: '<hr/>',
    },
    {
      config: 'require',
      template: '<img/>',
    },
    {
      config: 'require',
      template: '<input/>',
    },
    {
      config: 'require',
      template: '<keygen/>',
    },
    {
      config: 'require',
      template: '<link/>',
    },
    {
      config: 'require',
      template: '<meta/>',
    },
    {
      config: 'require',
      template: '<param/>',
    },
    {
      config: 'require',
      template: '<source/>',
    },
    {
      config: 'require',
      template: '<track/>',
    },
    {
      config: 'require',
      template: '<wbr/>',
    },
  ],

  bad: [
    {
      template: '<area/>',
      message: "Self-closing void element as <area> is redundant ('layout.hbs'@ L1:C0)",

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<area/>',
        line: 1,
        column: 0,
        fix: {
          text: '<area>',
        },
      },
    },
    {
      template: '<base/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<base/>',
        line: 1,
        column: 0,
        fix: {
          text: '<base>',
        },
      },
    },
    {
      template: '<br/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<br/>',
        line: 1,
        column: 0,
        fix: {
          text: '<br>',
        },
      },
    },
    {
      template: '<col/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<col/>',
        line: 1,
        column: 0,
        fix: {
          text: '<col>',
        },
      },
    },
    {
      template: '<command/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<command/>',
        line: 1,
        column: 0,
        fix: {
          text: '<command>',
        },
      },
    },
    {
      template: '<embed/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<embed/>',
        line: 1,
        column: 0,
        fix: {
          text: '<embed>',
        },
      },
    },
    {
      template: '<hr/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<hr/>',
        line: 1,
        column: 0,
        fix: {
          text: '<hr>',
        },
      },
    },
    {
      template: '<img/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<img/>',
        line: 1,
        column: 0,
        fix: {
          text: '<img>',
        },
      },
    },
    {
      template: '<input/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<input/>',
        line: 1,
        column: 0,
        fix: {
          text: '<input>',
        },
      },
    },
    {
      template: '<keygen/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<keygen/>',
        line: 1,
        column: 0,
        fix: {
          text: '<keygen>',
        },
      },
    },
    {
      template: '<link/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<link/>',
        line: 1,
        column: 0,
        fix: {
          text: '<link>',
        },
      },
    },
    {
      template: '<meta/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<meta/>',
        line: 1,
        column: 0,
        fix: {
          text: '<meta>',
        },
      },
    },
    {
      template: '<param/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<param/>',
        line: 1,
        column: 0,
        fix: {
          text: '<param>',
        },
      },
    },
    {
      template: '<source/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<source/>',
        line: 1,
        column: 0,
        fix: {
          text: '<source>',
        },
      },
    },
    {
      template: '<track/>',

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<track/>',
        line: 1,
        column: 0,
        fix: {
          text: '<track>',
        },
      },
    },
    {
      template: '<wbr/>',
      config: true,

      result: {
        message: 'Self-closing a void element is redundant',
        source: '<wbr/>',
        line: 1,
        column: 0,
        fix: {
          text: '<wbr>',
        },
      },
    },
    {
      template: '<area>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<area>',
        line: 1,
        column: 0,
        fix: {
          text: '<area/>',
        },
      },
    },
    {
      template: '<base>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<base>',
        line: 1,
        column: 0,
        fix: {
          text: '<base/>',
        },
      },
    },
    {
      template: '<br>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<br>',
        line: 1,
        column: 0,
        fix: {
          text: '<br/>',
        },
      },
    },
    {
      template: '<col>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<col>',
        line: 1,
        column: 0,
        fix: {
          text: '<col/>',
        },
      },
    },
    {
      template: '<command>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<command>',
        line: 1,
        column: 0,
        fix: {
          text: '<command/>',
        },
      },
    },
    {
      template: '<embed>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<embed>',
        line: 1,
        column: 0,
        fix: {
          text: '<embed/>',
        },
      },
    },
    {
      template: '<hr>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<hr>',
        line: 1,
        column: 0,
        fix: {
          text: '<hr/>',
        },
      },
    },
    {
      template: '<img>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<img>',
        line: 1,
        column: 0,
        fix: {
          text: '<img/>',
        },
      },
    },
    {
      template: '<input>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<input>',
        line: 1,
        column: 0,
        fix: {
          text: '<input/>',
        },
      },
    },
    {
      template: '<keygen>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<keygen>',
        line: 1,
        column: 0,
        fix: {
          text: '<keygen/>',
        },
      },
    },
    {
      template: '<link>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<link>',
        line: 1,
        column: 0,
        fix: {
          text: '<link/>',
        },
      },
    },
    {
      template: '<meta>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<meta>',
        line: 1,
        column: 0,
        fix: {
          text: '<meta/>',
        },
      },
    },
    {
      template: '<param>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<param>',
        line: 1,
        column: 0,
        fix: {
          text: '<param/>',
        },
      },
    },
    {
      template: '<source>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<source>',
        line: 1,
        column: 0,
        fix: {
          text: '<source/>',
        },
      },
    },
    {
      template: '<track>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<track>',
        line: 1,
        column: 0,
        fix: {
          text: '<track/>',
        },
      },
    },
    {
      template: '<wbr>',
      config: 'require',

      result: {
        message: 'Self-closing a void element is required',
        source: '<wbr>',
        line: 1,
        column: 0,
        fix: {
          text: '<wbr/>',
        },
      },
    },
  ],
});
