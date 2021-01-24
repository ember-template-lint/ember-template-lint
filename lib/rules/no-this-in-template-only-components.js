'use strict';

const fs = require('fs');
const path = require('path');

const Rule = require('./base');

function message(original, fixed) {
  return (
    `Usage of 'this' in path '${original}' is not allowed in a template-only component. ` +
    `Use '${fixed}' if it is a named argument or create a component.js for this component.`
  );
}

/**
 * Gets the path where a component class file might reside
 * @param hbsFilePath - path to the template file
 * @returns {string | undefined} - possible path to the component file, not including extension
 * or undefined if the template does not have a component class
 */
function getComponentPath(hbsFilePath) {
  if (!hbsFilePath) {
    // possibly a hbs template literal using eslint-plugin-hbs
    return;
  }
  const paths = path.normalize(hbsFilePath).split(path.sep);
  const moduleName = path.basename(hbsFilePath, '.hbs');
  if (paths[0] === 'app' || paths[0] === 'addon') {
    if (paths[1] === 'templates') {
      if (paths[2] === 'components') {
        // classic structure: /app/templates/components/foo.hbs => /app/components/foo.js
        return path.join(paths[0], 'components', ...paths.slice(3, -1), moduleName);
      }
      // route template always has a controller as its context, even if no controller.js exists
      return;
    }
    if ((paths[1] === 'components' || paths[2] === 'components') && moduleName === 'template') {
      // pods structure, possibly with podModulePrefix:
      //   /app/components/foo/template.hbs => /app/components/foo/component.js
      //   /app/<prefix>/components/foo/template.hbs => /app/<prefix>/components/foo/component.js
      return path.join(path.dirname(hbsFilePath), 'component');
    }
    if (paths[1] === 'components') {
      // co-located structure: /app/components/foo.hbs => /app/components/foo.js
      return path.join(path.dirname(hbsFilePath), moduleName);
    }
  } else if (paths[0] === 'tests' && paths[1] === 'dummy') {
    // search inside addon dummy app
    const appPath = getComponentPath(path.join(...paths.slice(2)));
    if (!appPath) {
      return;
    }
    return path.join('tests', 'dummy', appPath);
  }
}

/**
 * Tests whether the template has a corresponding component class file
 * @param hbsFilePath - path to the template file
 * @param validComponentExtensions - an array of valid component class extensions
 * @returns {boolean} true if a component class was found
 */
function isTemplateOnlyComponent(hbsFilePath, validComponentExtensions) {
  const componentPath = getComponentPath(hbsFilePath);
  if (!componentPath) {
    return false;
  }
  return !validComponentExtensions.some((ext) => fs.existsSync(componentPath + ext));
}

/**
 * Properties which should be excluded from auto-fix.
 *
 * For example, `{{this.elementId}}` in a template-only component is
 * most likely a bug and should not be converted to `{{@elementId}}`.
 */
const builtInProperties = [
  'action',
  'actionContext',
  'actionContextObject',
  'attributeBindings',
  'childViews',
  'classNameBindings',
  'classNames',
  'concatenatedProperties',
  'element',
  'elementId',
  'parentView',
  'tagName',
  'target',
];

function isFixable(original) {
  return !builtInProperties.some((property) => {
    return original === `this.${property}`;
  });
}

const DEFAULT_CONFIG = {
  validComponentExtensions: ['.js', '.ts'],
};

module.exports = class NoThisInTemplateOnlyComponents extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config ? DEFAULT_CONFIG : false;
      case 'object':
        return { validComponentExtensions: config.validComponentExtensions };
      case 'undefined':
        return false;
    }
  }

  visitor() {
    if (!isTemplateOnlyComponent(this._filePath, this.config.validComponentExtensions)) {
      // template is allowed to use `this`
      return null;
    }

    return {
      PathExpression(path) {
        if (path.this) {
          const fixed = path.original.replace(/^this\./, '@');
          if (this.mode === 'fix' && isFixable(path.original)) {
            path.original = fixed;
          } else {
            this.log({
              message: message(path.original, fixed),
              line: path.loc && path.loc.start.line,
              column: path.loc && path.loc.start.column,
              source: this.sourceForNode(path),
              isFixable: isFixable(path.original),
            });
          }
        }
      },
    };
  }
};

module.exports.message = message;
