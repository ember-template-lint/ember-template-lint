'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'img-redundant-alt',

  config: true,

  good: [
    '<img alt="hullo">',
    '<img alt="some-alt-name">',
    '<img alt={{foo}}>',
    '<img alt="blah {{derp}}">',
    '<img alt="name {{picture}}">',
    '<img aria-hidden="true">',
    '<img alt="">',
    '<img alt="{{picture}}">',
    '<img alt>',
  ],

  bad: [
    {
      template: '<img alt="picture">',

      result: {
        message:
          'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt attribute.',
        moduleId: 'layout.hbs',
        source: '<img alt="picture">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="photo">',

      result: {
        message:
          'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt attribute.',
        moduleId: 'layout.hbs',
        source: '<img alt="photo">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="image">',

      result: {
        message:
          'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt attribute.',
        moduleId: 'layout.hbs',
        source: '<img alt="image">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="  IMAGE ">',

      result: {
        message:
          'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt attribute.',
        moduleId: 'layout.hbs',
        source: '<img alt="  IMAGE ">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="  IMAGE {{picture}} {{word}} ">',

      result: {
        message:
          'Redundant alt attribute. Screen-readers already announce `img` tags as an image. You don’t need to use the words `image`, `photo,` or `picture` (or any specified custom words) in the alt attribute.',
        moduleId: 'layout.hbs',
        source: '<img alt="  IMAGE {{picture}} {{word}} ">',
        line: 1,
        column: 0,
      },
    },
  ],
});
