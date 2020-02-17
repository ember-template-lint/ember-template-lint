const globby = require('globby');

module.exports = function expandFileGlobs(positional, isAbsolute) {
  let result = new Set();

  positional.forEach(item => {
    globby
      .sync(item, {
        ignore: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
        gitignore: true,
        absolute: isAbsolute,
      })
      .filter(filePath => filePath.slice(-4) === '.hbs')
      .forEach(filePath => result.add(filePath));
  });

  return result;
};
