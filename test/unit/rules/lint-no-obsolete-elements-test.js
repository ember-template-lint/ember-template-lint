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
    },
    {
      template: '<dir></dir>',

      result: {
        message: 'Deprecated element. Use ul instead.',
        line: 1,
        column: 0,
        source: '<dir></dir>',
      },
    },
    {
      template: '<frame></frame>',

      result: {
        message:
          'Deprecated element. Either use iframe and CSS instead, or use server-side includes to generate complete pages with the various invariant parts merged in.',
        line: 1,
        column: 0,
        source: '<frame></frame>',
      },
    },
    {
      template: '<frameset></frameset>',

      result: {
        message:
          'Deprecated element. Either use iframe and CSS instead, or use server-side includes to generate complete pages with the various invariant parts merged in.',
        line: 1,
        column: 0,
        source: '<frameset></frameset>',
      },
    },
    {
      template: '<noframes></noframes>',

      result: {
        message:
          'Deprecated element. Either use iframe and CSS instead, or use server-side includes to generate complete pages with the various invariant parts merged in.',
        line: 1,
        column: 0,
        source: '<noframes></noframes>',
      },
    },
    {
      template: '<isindex></isindex>',

      result: {
        message: 'Deprecated element. Use an explicit form and text control combination instead.',
        line: 1,
        column: 0,
        source: '<isindex></isindex>',
      },
    },
    {
      template: '<keygen></keygen>',

      result: {
        message: 
          'Deprecated element. Use native on-device management capabilities or use the Web Cryptography API',
        line: 1,
        column: 0,
        source: '<keygen></keygetn>',
      },
    },
    {
      template: '<listing></listing>',

      result: {
        message: 'Deprecated element. Use pre and code instead.',
        line: 1,
        column: 0,
        source: '<listing></listing>',
      },
    },
    {
      template: '<menuitem></menuitem>',

      result: {
        message: 
          'Deprecated element. To implement a custom context menu, use script to handle the contextmenu event.',
        line: 1,
        column: 0,
        source: '<menuitem></menuitem>',
      },
    },
    {
      template: '<nextid></nextid>',

      result: {
        message: 'Deprecated element. Use GUIDs instead.',
        line: 1,
        column: 0,
        source: '<nextid></nextid>',
      },
    },
    {
      template: '<noembed></noembed>',

      result: {
        message: 'Deprecated element. Use object instead of embed when fallback is necessary.',
        line: 1,
        column: 0,
        source: '<noembed></noembed>',
      },
    },
    {
      template: '<rb></rb>',

      result: {
        message: 
          'Deprecated element. Providing the ruby base directly inside the ruby element or using nested ruby elements is sufficient.',
        line: 1,
        column: 0,
        source: '<rb></rb>',
      },
    },
    {
      template: '<rtc></rtc>',

      result: {
        message: 
          'Deprecated element. Providing the ruby base directly inside the ruby element or using nested ruby elements is sufficient.',
        line: 1,
        column: 0,
        source: '<rtc></rtc>',
      },
    },
    {
      template: '<strike></strike>',

      result: {
        message: 'Deprecated element. Use del instead.',
        line: 1,
        column: 0,
        source: '<strike></strike>',
      },
    },
    {
      template: '<xmp></xmp>',

      result: {
        message: 
          'Deprecated element. Use pre and code instead, and escape "<" and "&" characters as "&lt;" and "&amp;" respectively.',
        line: 1,
        column: 0,
        source: '<xmp></xmp>',
      },
    },
    {
      template: '<basefont></basefont>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<basefont></basefont>',
      },
    },
    {
      template: '<big></big>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<big></big>',
      },
    },
    {
      template: '<blink></blink>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<blink></blink>',
      },
    },
    {
      template: '<center></center>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<center></center>',
      },
    },
    {
      template: '<font></font>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<font></font>',
      },
    },
    {
      template: '<marquee></marquee>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<marquee></marquee>',
      },
    },
    {
      template: '<multicol></multicol>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<multicol></multicol>',
      },
    },
    {
      template: '<nobr></nobr>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<nobr></nobr>',
      },
    },
    {
      template: '<spacer></spacer>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<spacer></spacer>',
      },
    },
    {
      template: '<tt></tt>',

      result: {
        message: 'Deprecated element. Use appropriate elements or CSS instead.',
        line: 1,
        column: 0,
        source: '<tt></tt>',
      },
    }
  ],
});
