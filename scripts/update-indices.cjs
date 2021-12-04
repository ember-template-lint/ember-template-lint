const { writeFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const rulesPath = join(__dirname, '..', 'lib', 'rules');
exportDirectoryToIndex(rulesPath);

const configPath = join(__dirname, '..', 'lib', 'config');
exportDirectoryToIndex(configPath);

function fileNameToVariableName(fileName) {
  const fileNameWithoutDashes = fileName.replaceAll('-', '');
  return /^\d/.test(fileNameWithoutDashes) ? `_${fileNameWithoutDashes}` : fileNameWithoutDashes;
}

function exportDirectoryToIndex(dir) {
  const files = readdirSync(dir)
    .filter((fileName) => {
      return fileName.endsWith('.js') && fileName !== 'index.js' && !fileName.startsWith('_');
    })
    .map((fileName) => fileName.replace('.js', ''));

  let fileContents = '';

  for (const fileName of files) {
    const fileNameWithoutDashes = fileNameToVariableName(fileName);
    fileContents += `import ${fileNameWithoutDashes} from './${fileName}.js';\n`;
  }

  fileContents += '\nexport default {\n';

  for (const fileName of files) {
    const fileNameWithoutDashes = fileNameToVariableName(fileName);
    const property = fileName.includes('-') ? `'${fileName}': ${fileNameWithoutDashes}` : fileName;
    fileContents += `  ${property},\n`;
  }

  fileContents += '};\n';

  writeFileSync(join(dir, 'index.js'), fileContents);
}
