'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-obsolete-elements',

  config: false,

  good: [
    '<div></div>',
    '<embed></embed>',
    '<object></object>',
    '<audio></audio>',
    '<ul></ul>',
    '<iframe></iframe>',
    '<form></form>',
    '<pre></pre>',
    '<code></code>',
    '<ruby></ruby>',
    '<del></del>',
    '<s></s>'
  ],

  bad: [
    {
      template: '<applet></applet>',

      result: {
        message: 'Deprecated element. Use embed or object instead.',
        line: 1,
        column: 0,
        source: '<applet></applet>',
      },
    },
    {
      template: '<acronym></acronym>',

      result: {
        message: 'Deprecated element. Use abbr instead.',
        line: 1,
        column: 0,
        source: '<acronym></acronym>',
      },
    },
    {
      template: '<bgsound></bgsound>',

      result: {
        message: 'Deprecated element. Use audio instead.',
        line: 1,
        column: 0,
        source: '<bgsound></bgsound>',
      },
    }
  ],
});
