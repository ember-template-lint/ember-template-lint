const { print, transform } = require('ember-template-recast');

/**
 * Compares the locations of two objects in a source file
 * @param {line: number, column: number} itemA The first object
 * @param {line: number, column: number} itemB The second object
 * @returns {number} A value less than 1 if itemA appears before itemB in the source file, greater than 1 if
 * itemA appears after itemB in the source file, or 0 if itemA and itemB have the same location.
 */
function compareLocations(itemA, itemB) {
  return itemA.line - itemB.line || itemA.column - itemB.column;
}

/**
 * @param {string} source - The source code to fix.
 * @param {Object} fixer - A visitor that will fix the template
 * @returns {Object} result - The fixed source
 */
function applyFix(source, fixer) {
  let { ast } = transform(source, fixer);
  return print(ast);
}

/**
 * @param {Object} options
 * @param {string} options.source - The source code to fix.
 * @param {Object[]} messages - The lint messages.
 * @returns {string} output - The fixed source.
 */
function applyFixes(options, messages) {
  // here sort the messages by position
  let fixers = messages.filter(message => Boolean(message.fixer));

  if (!fixers.length) {
    return options.source;
  }

  let [message] = fixers.sort(compareLocations);

  return applyFix(options.source, message.fixer);
}

module.exports = applyFixes;
