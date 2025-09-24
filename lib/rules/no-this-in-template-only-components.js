import fs from 'node:fs';
import path from 'node:path';

import Rule from './_base.js';

function message(original, fixed) {
  return (
    `Usage of 'this' in path '${original}' is not allowed in a template-only component. ` +
    `Use '${fixed}' if it is a named argument or create a component.js for this component.`
  );
}

const glimmerScriptExtensions = ['.gjs', '.gts'];

/**
 * Tests whether the template has a corresponding component class file
 * @param hbsFilePath - path to the template file
 * @param validComponentExtensions - an array of valid component class extensions
 * @returns {boolean} true if a component class was found
 */
function isTemplateOnlyComponent(hbsFilePath, validComponentExtensions) {
  if (
    glimmerScriptExtensions.some((ext) => {
      return hbsFilePath.endsWith(ext);
    })
  ) {
    return false;
  }
  /**
   * Tests whether the component class exists as `component.js`, `component.ts`, etc.
   */
  function componentClassExists(pathWithoutExtension) {
    return validComponentExtensions.some((ext) => fs.existsSync(pathWithoutExtension + ext));
  }

  /**
   * These are valid component class locations:
   * --component-structure=classic
   *   app/templates/components/foo-classic.hbs => app/components/foo-classic.{js,ts}
   * --component-structure=flat
   *   app/components/foo-flat.hbs => app/components/foo-flat.{js,ts}
   * --component-structure=nested
   *   app/components/foo-nested/index.hbs => app/components/foo-nested/index.{js,ts}
   * --pod, -pods
   *   app/components/foo-pod/template.hbs => app/components/foo-pod/component.{js,ts}
   */

  const paths = path.normalize(hbsFilePath).split(path.sep);

  while (paths.length > 0 && paths[0] !== 'app' && paths[0] !== 'addon') {
    paths.shift();
  }

  if (paths.length === 0) {
    // no app or addon directory found
    return false;
  }
  if (paths[0] === 'app' || paths[0] === 'addon') {
    if (paths[1] === 'templates') {
      if (paths[2] === 'components') {
        // classic structure: app/templates/components/foo-classic.hbs =>  app/components/foo-classic.{js,ts}
        const moduleName = path.basename(hbsFilePath, '.hbs');
        const classFilePath = path.join(paths[0], 'components', ...paths.slice(3, -1), moduleName);
        return !componentClassExists(classFilePath);
      } else {
        // route template always has a context
        return false;
      }
    } else if (paths[1] === 'components') {
      const moduleName = path.basename(hbsFilePath, '.hbs');
      let classFilePath;

      if (moduleName === 'index') {
        // nested structure: app/components/foo-nested/index.hbs => app/components/foo-nested/index.{js,ts}
        classFilePath = path.join(path.dirname(hbsFilePath), 'index');
      } else if (moduleName === 'template') {
        // pod structure: app/components/foo-pod/template.hbs => app/components/foo-pod/component.{js,ts}
        classFilePath = path.join(path.dirname(hbsFilePath), 'component');
      } else {
        // flat structure: app/components/foo.hbs => app/components/foo.{js,ts}
        classFilePath = path.join(path.dirname(hbsFilePath), moduleName);
      }

      return !componentClassExists(classFilePath);
    }
  }
  // TODO: handle pods layout
  return true;
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

export default class NoThisInTemplateOnlyComponents extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        return { validComponentExtensions: config.validComponentExtensions };
      }
      case 'undefined': {
        return false;
      }
    }
  }
  /**
   * @returns {import('./types.js').VisitorReturnType<NoThisInTemplateOnlyComponents>}
   */
  visitor() {
    if (!isTemplateOnlyComponent(this.filePath, this.config.validComponentExtensions)) {
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
              node: path,
              isFixable: isFixable(path.original),
            });
          }
        }
      },
    };
  }
}
