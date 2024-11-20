// Helpers for the CLI binary.

import ci from 'ci-info';
import { globbySync } from 'globby';
import isGlob from 'is-glob';
import micromatch from 'micromatch';
import fs from 'node:fs';
import path from 'node:path';
import yargs from 'yargs';

import { SUPPORTED_EXTENSIONS } from '../extract-templates.js';
import camelize from './camelize.js';

const STDIN = '/dev/stdin';

class NoMatchingFilesError extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'NoMatchingFilesError';
  }
}

function getVersion() {
  const json = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url)));

  return json.version;
}

export function parseArgv(_argv) {
  const specifiedOptions = {
    'config-path': {
      describe: 'Define a custom config path (default: .template-lintrc.js)',
      type: 'string',
    },
    config: {
      describe:
        'Define a custom configuration to be used - (e.g. \'{ "rules": { "no-implicit-this": "error" } }\') ',
      type: 'string',
    },
    quiet: {
      describe: 'Ignore warnings and only show errors',
      boolean: true,
    },
    rule: {
      describe:
        'Specify a rule and its severity to add that rule to loaded rules - (e.g. `no-implicit-this:error` or `rule:["error", { "allow": ["some-helper"] }]`)',
      type: 'string',
    },
    filename: {
      describe: 'Used to indicate the filename to be assumed for contents from STDIN',
      type: 'string',
    },
    fix: {
      describe: 'Fix any errors that are reported as fixable',
      boolean: true,
      default: false,
    },
    format: {
      describe: 'Specify format to be used in printing output',
      type: 'string',
      default: 'pretty',
    },
    'output-file': {
      describe: 'Specify file to write report to',
      type: 'string',
    },
    verbose: {
      describe: 'Output errors with source description',
      boolean: true,
    },
    'working-directory': {
      alias: 'cwd',
      describe: 'Path to a directory that should be considered as the current working directory.',
      type: 'string',
      // defaulting to `.` here to refer to `process.cwd()`, setting the default to `process.cwd()` itself
      // would make our snapshots unstable (and make the help output unaligned since most directory paths
      // are fairly deep)
      default: '.',
    },
    'no-config-path': {
      describe: 'Does not use the local template-lintrc, will use a blank template-lintrc instead',
      boolean: true,
    },
    'update-todo': {
      describe: 'Update list of linting todos by transforming lint errors to todos',
      default: false,
      boolean: true,
    },
    'include-todo': {
      describe: 'Include todos in the results',
      default: false,
      boolean: true,
    },
    'clean-todo': {
      describe: 'Remove expired and invalid todo files',
      default: !ci.isCI,
      boolean: true,
    },
    'compact-todo': {
      describe: 'Compacts the .lint-todo storage file, removing extraneous todos',
      boolean: true,
    },
    'todo-days-to-warn': {
      describe: 'Number of days after its creation date that a todo transitions into a warning',
      type: 'number',
    },
    'todo-days-to-error': {
      describe: 'Number of days after its creation date that a todo transitions into an error',
      type: 'number',
    },
    'ignore-pattern': {
      describe: 'Specify custom ignore pattern (can be disabled with --no-ignore-pattern)',
      type: 'array',
      default: ['**/dist/**', '**/tmp/**', '**/node_modules/**'],
    },
    'no-inline-config': {
      describe: 'Prevent inline configuration comments from changing config or rules',
      boolean: true,
    },
    'print-config': {
      describe: 'Print the configuration for the given file',
      default: false,
      boolean: true,
    },
    'max-warnings': {
      describe: 'Number of warnings to trigger nonzero exit code',
      type: 'number',
    },
    'no-error-on-unmatched-pattern': {
      describe: 'Prevent errors when pattern is unmatched',
      boolean: true,
    },
  };

  let parser = yargs()
    .scriptName('ember-template-lint')
    .usage('$0 [options] [files..]')
    .options(specifiedOptions)
    .help()
    .version('version', getVersion());

  parser.parserConfiguration({
    'greedy-arrays': false,
  });

  if (_argv.length === 0) {
    parser.showHelp();
    parser.exit(1);
  } else {
    let options = parser.parse(_argv);

    // TODO: Eventually use yargs strict() or strictOptions() to disallow unknown options (blocked by some inconsistencies in how we tell yargs about our options).
    const possibleOptionNames = getPossibleOptionNames(specifiedOptions);
    for (const optionName of Object.keys(options)) {
      if (
        !['$0', '_'].includes(optionName) && // Built-in yargs options.
        !possibleOptionNames.includes(optionName)
      ) {
        console.error(`Unknown option: --${optionName}`);
        parser.exit(1);
        return;
      }
    }

    if (options.workingDirectory === '.') {
      options.workingDirectory = process.cwd();
    }

    return options;
  }
}

export function expandFileGlobs(
  workingDir,
  filePatterns,
  ignorePattern,
  glob = executeGlobby,
  errorOnUnmatchedPattern = true
) {
  let result = new Set();

  for (const pattern of filePatterns) {
    let isLiteralPath = !isGlob(pattern) && isFile(path.resolve(workingDir, pattern));

    if (isLiteralPath) {
      // If `--no-ignore-pattern` is passed, the ignorePatter is `[false]`.
      let isIgnored =
        !(ignorePattern?.length === 1 && ignorePattern[0] === false) &&
        micromatch.isMatch(pattern, ignorePattern);

      if (!isIgnored) {
        result.add(pattern);
      }

      continue;
    }

    const globResults = glob(workingDir, pattern, ignorePattern);
    if (errorOnUnmatchedPattern && (!globResults || globResults.length === 0)) {
      throw new NoMatchingFilesError(`No files matching the pattern were found: "${pattern}"`);
    }

    for (const filePath of globResults) {
      result.add(filePath);
    }
  }

  return result;
}

export function getFilesToLint(
  workingDir,
  filePatterns,
  ignorePattern = [],
  errorOnUnmatchedPattern = true
) {
  let files;

  if (filePatterns.length === 0 || filePatterns.includes('-') || filePatterns.includes(STDIN)) {
    files = new Set([STDIN]);
  } else {
    files = expandFileGlobs(
      workingDir,
      filePatterns,
      ignorePattern,
      executeGlobby,
      errorOnUnmatchedPattern
    );
  }

  return files;
}

/**
 * @param {Object} specifiedOptions - options passed to yargs (option names should be in dasherized format)
 * @returns {String[]} a list of all possible CLI option names
 */
export function getPossibleOptionNames(specifiedOptions) {
  const optionAliases = Object.values(specifiedOptions)
    .map((option) => option.alias)
    .filter((option) => option !== undefined);
  const dasherizedOptionNames = [...Object.keys(specifiedOptions), ...optionAliases];
  const camelizedOptionNames = dasherizedOptionNames.map((name) => camelize(name));
  const negatedDasherizedOptionNames = dasherizedOptionNames.map((name) =>
    name.startsWith('no-') ? name.slice(3) : `no-${name}`
  );
  const negatedCamelizedOptionNames = negatedDasherizedOptionNames.map((name) => camelize(name));
  return [
    ...dasherizedOptionNames,
    ...camelizedOptionNames,
    // Since yargs `boolean-negation` option is enabled (by default), assume any option can be passed with `no`/negated prefix.
    ...negatedDasherizedOptionNames,
    ...negatedCamelizedOptionNames,
  ];
}

function executeGlobby(workingDir, pattern, ignore) {
  let supportedExtensions = new Set(['.hbs', '.handlebars', ...SUPPORTED_EXTENSIONS]);

  // `--no-ignore-pattern` results in `ignorePattern === [false]`
  let options =
    ignore[0] === false ? { cwd: workingDir } : { cwd: workingDir, gitignore: true, ignore };

  return globbySync(pattern, options).filter((filePath) =>
    supportedExtensions.has(path.extname(filePath))
  );
}

function isFile(possibleFile) {
  try {
    let stat = fs.statSync(possibleFile);
    return stat.isFile();
  } catch {
    return false;
  }
}
