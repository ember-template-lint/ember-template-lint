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

function isTemplateOnlyComponent(hbsFilePath) {
  const paths = hbsFilePath.split(path.sep);
  if (paths[0] === 'app' || paths[0] === 'addon') {
    if (paths[1] === 'templates') {
      if (paths[2] === 'components') {
        // classic structure: /app/templates/components/foo.hbs => /app/components/foo.js
        const moduleName = path.basename(hbsFilePath, '.hbs');
        const jsFilePath = path.join(
          paths[0],
          'components',
          ...paths.slice(3, -1),
          `${moduleName}.js`
        );
        return !fs.existsSync(jsFilePath);
      } else {
        // route template always has a context
        return false;
      }
    } else if (paths[1] === 'components') {
      // co-located structure: /app/components/foo.hbs => /app/components/foo.js
      const moduleName = path.basename(hbsFilePath, '.hbs');
      const jsFilePath = path.join(path.dirname(hbsFilePath), `${moduleName}.js`);
      return !fs.existsSync(jsFilePath);
    }
  }
  // TODO: handle pods layout
  return true;
}

function isFixable(original) {
  if (original === 'this.elementId') {
    // elementId usage in a template-only component can't be auto-fixed
    return false;
  }
  return true;
}

module.exports = class NoThisInTemplateOnlyComponents extends Rule {
  visitor() {
    if (!isTemplateOnlyComponent(this._filePath)) {
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
