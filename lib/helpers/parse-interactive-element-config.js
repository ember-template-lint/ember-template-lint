'use strict';

function configValid(config) {
  for (let key in config) {
    let value = config[key];

    switch (key) {
    case 'ignoredTags':
    case 'additionalInteractiveTags':
      if (!Array.isArray(value)) {
        return false;
      }
      break;
    case 'ignoreTabindex':
    case 'ignoreUsemapAttribute':
      if (typeof value !== 'boolean') {
        return false;
      }
      break;
    default:
      return false;
    }
  }

  return true;
}

module.exports = function(ruleName, config) {
  let configType = typeof config;

  let errorMessage = [
    'The ' + ruleName + ' rule accepts one of the following values.',
    '  * boolean - `true` to enable / `false` to disable',
    '  * object - Containing the following values:',
    '    * `ignoredTags` - An array of element tag names that should be whitelisted. Default to `[]`.',
    '    * `ignoreTabindex` - When `true` tabindex will be ignored. Defaults to `false`.',
    '    * `ignoreUsemapAttribute` - When `true` ignores the `usemap` attribute on `img` and `object` elements. Defaults `false`.',
    '    * `additionalInteractiveTags` - An array of element tag names that should also be considered as interactive. Defaults to `[]`.',
    'You specified `' + JSON.stringify(config) + '`'
  ].join('\n');

  switch (configType) {
  case 'boolean':
    return config;
  case 'object':
    if (configValid(config)) {
      return config;
    } else {
      throw new Error(errorMessage);
    }
  case 'undefined':
    return false;
  default:
    throw new Error(errorMessage);
  }
};
