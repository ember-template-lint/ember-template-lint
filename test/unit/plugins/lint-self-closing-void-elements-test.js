'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'lint-self-closing-void-elements',

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
    '<wbr>'
  ],

  bad: [
    { template: '<area/>', message: 'Self-closing void element as <area> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<base/>', message: 'Self-closing void element as <base> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<br/>', message: 'Self-closing void element as <br> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<col/>', message: 'Self-closing void element as <col> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<command/>', message: 'Self-closing void element as <command> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<embed/>', message: 'Self-closing void element as <embed> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<hr/>', message: 'Self-closing void element as <hr> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<img/>', message: 'Self-closing void element as <img> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<input/>', message: 'Self-closing void element as <input> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<keygen/>', message: 'Self-closing void element as <keygen> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<link/>', message: 'Self-closing void element as <link> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<meta/>', message: 'Self-closing void element as <meta> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<param/>', message: 'Self-closing void element as <param> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<source/>', message: 'Self-closing void element as <source> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<track/>', message: 'Self-closing void element as <track> is redundant (\'layout.hbs\'@ L1:C0)' },
    { template: '<wbr/>', config: true, message: 'Self-closing void element as <wbr> is redundant (\'layout.hbs\'@ L1:C0)' }
  ]
});
