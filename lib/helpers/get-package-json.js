const fs = require('fs-extra');
const path = require('path');

module.exports = function getPackageJson(basePath = process.cwd()) {
  let _package = {};
  const packageJsonPath = path.join(path.resolve(basePath), 'package.json');

  try {
    _package = fs.readJsonSync(packageJsonPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `The ${path.resolve(basePath)} directory does not contain a package.json file.`
      );
    }
  }

  return _package;
};
