'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-obsolete-elements',

  config: true,

  good: ['<div></div>'],

  bad: [
    {
      template: '<applet></applet>',
      result: {
        message: 'Use of <applet> detected. Do not use deprecated elements.',
        moduleId: 'layout.hbs',
        line: 1,
        column: 0,
        source: '<applet></applet>',
      },
    },
    {
      template: '<acronym></acronym>',
      result: {
        message: 'Use of <acronym> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<acronym></acronym>',
      },
    },
    {
      template: '<bgsound></bgsound>',
      result: {
        message: 'Use of <bgsound> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<bgsound></bgsound>',
      },
    },
    {
      template: '<dir></dir>',
      result: {
        message: 'Use of <dir> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<dir></dir>',
      },
    },
    {
      template: '<frame></frame>',
      result: {
        message: 'Use of <frame> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<frame></frame>',
      },
    },
    {
      template: '<frameset></frameset>',
      result: {
        message: 'Use of <frameset> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<frameset></frameset>',
      },
    },
    {
      template: '<noframes></noframes>',
      result: {
        message: 'Use of <noframes> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<noframes></noframes>',
      },
    },
    {
      template: '<isindex></isindex>',
      result: {
        message: 'Use of <isindex> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<isindex></isindex>',
      },
    },
    {
      template: '<keygen>',
      result: {
        message: 'Use of <keygen> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<keygen>',
      },
    },
    {
      template: '<listing></listing>',
      result: {
        message: 'Use of <listing> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<listing></listing>',
      },
    },
    {
      template: '<menuitem></menuitem>',
      result: {
        message: 'Use of <menuitem> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<menuitem></menuitem>',
      },
    },
    {
      template: '<nextid></nextid>',
      result: {
        message: 'Use of <nextid> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<nextid></nextid>',
      },
    },
    {
      template: '<noembed></noembed>',
      result: {
        message: 'Use of <noembed> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<noembed></noembed>',
      },
    },
    {
      template: '<rb></rb>',
      result: {
        message: 'Use of <rb> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<rb></rb>',
      },
    },
    {
      template: '<rtc></rtc>',
      result: {
        message: 'Use of <rtc> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<rtc></rtc>',
      },
    },
    {
      template: '<strike></strike>',
      result: {
        message: 'Use of <strike> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<strike></strike>',
      },
    },
    {
      template: '<xmp></xmp>',
      result: {
        message: 'Use of <xmp> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<xmp></xmp>',
      },
    },
    {
      template: '<basefont></basefont>',
      result: {
        message: 'Use of <basefont> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<basefont></basefont>',
      },
    },
    {
      template: '<big></big>',
      result: {
        message: 'Use of <big> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<big></big>',
      },
    },
    {
      template: '<blink></blink>',
      result: {
        message: 'Use of <blink> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<blink></blink>',
      },
    },
    {
      template: '<center></center>',
      result: {
        message: 'Use of <center> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<center></center>',
      },
    },
    {
      template: '<font></font>',
      result: {
        message: 'Use of <font> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<font></font>',
      },
    },
    {
      template: '<marquee></marquee>',
      result: {
        message: 'Use of <marquee> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<marquee></marquee>',
      },
    },
    {
      template: '<multicol></multicol>',
      result: {
        message: 'Use of <multicol> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<multicol></multicol>',
      },
    },
    {
      template: '<nobr></nobr>',
      result: {
        message: 'Use of <nobr> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<nobr></nobr>',
      },
    },
    {
      template: '<spacer></spacer>',
      result: {
        message: 'Use of <spacer> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<spacer></spacer>',
      },
    },
    {
      template: '<tt></tt>',
      result: {
        message: 'Use of <tt> detected. Do not use deprecated elements.',
        line: 1,
        column: 0,
        source: '<tt></tt>',
      },
    },
  ],
});
