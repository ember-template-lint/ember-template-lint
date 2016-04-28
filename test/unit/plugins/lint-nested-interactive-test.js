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
    { config: ['a'], template: '<a href="/">button<a href="/">!</a></a>', message: 'Don\'t use <a> inside <a> (\'layout.hbs\'@ L1:C18)' },
    { config: ['a', 'button'], template: '<a href="/">button<button>!</button></a>', message: 'Don\'t use <button> inside <a> (\'layout.hbs\'@ L1:C18)' },
    { config: ['a', 'button'], template: '<button>button<a href="/">!</a></button>', message: 'Don\'t use <a> inside <button> (\'layout.hbs\'@ L1:C14)' },
    { config: ['button'], template: '<button>button<button>!</button></button>', message: 'Don\'t use <button> inside <button> (\'layout.hbs\'@ L1:C14)' },
    { config: ['button', 'input'], template: '<button><input type="text"></button>', message: 'Don\'t use <input> inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'details'], template: '<button><details><summary>Some details</summary><p>!</p></details></button>', message: 'Don\'t use <details> inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'embed'], template: '<button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button>', message: 'Don\'t use <embed> inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'iframe'], template: '<button><iframe src="/frame.html" width="640" height="480"></iframe></button>', message: 'Don\'t use <iframe> inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'select'], template: '<button><select></select></button>', message: 'Don\'t use <select> inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'textarea'], template: '<button><textarea></textarea></button>', message: 'Don\'t use <textarea> inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'tabindex'], template: '<div tabindex="1"><button></button></div>', message: 'Don\'t use <button> inside an element with attribute `tabindex` (\'layout.hbs\'@ L1:C18)' },
    { config: ['button', 'tabindex'], template: '<button><div tabindex="1"></div></button>', message: 'Don\'t use an element with attribute `tabindex` inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'img'], template: '<button><img usemap=""></button>', message: 'Don\'t use an element with attribute `usemap` inside <button> (\'layout.hbs\'@ L1:C8)' },
    { config: ['button', 'object'], template: '<object usemap=""><button></button></object>', message: 'Don\'t use <button> inside an element with attribute `usemap` (\'layout.hbs\'@ L1:C18)' }
  ]
});
