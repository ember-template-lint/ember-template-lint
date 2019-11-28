/**
 * @param {Object} options
 * @param {string} options.source - The source code to fix.
 * @param {Object[]} messages - The lint messages.
 * @returns {string} output - The fixed source.
 */
function applyFixes(options, messages) {
  let output = options.source;

  let fixes = messages.filter(message => Boolean(message.fix));

  if (!fixes.length) {
    return output;
  }

  for (const fix of fixes) {
    output = applyFix(source, fix);
  }

  return output;
}

module.exports = applyFixes;
