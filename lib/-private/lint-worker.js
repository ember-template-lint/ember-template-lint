import { parentPort, workerData } from 'node:worker_threads';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import Linter from '../linter.js';
import { processWithPool } from './process-with-pool.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Extract data passed from the main thread
const { filePaths, options } = workerData;

function removeExt(filePath) {
  return filePath.slice(0, -path.extname(filePath).length);
}

async function buildLinterOptions(workingDir, filePath) {
  let moduleId = removeExt(filePath);
  let resolvedFilePath = path.resolve(workingDir, filePath);
  let source = await readFile(resolvedFilePath, { encoding: 'utf8' });

  return { source, filePath, moduleId };
}

async function processFiles() {
  // Create a linter instance
  const linter = new Linter({
    workingDir: options.workingDirectory,
    configPath: options.configPath,
    rule: options.rule,
    allowInlineConfig: !options.noInlineConfig,
    reportUnusedDisableDirectives: options.reportUnusedDisableDirectives,
    console: { log: () => {}, warn: () => {}, error: () => {} }, // Silent console in workers
  });

  // Process a single file and return its results
  async function processFile(filePath) {
    const linterOptions = await buildLinterOptions(options.workingDirectory, filePath);

    let fileResults;

    if (options.fix) {
      let { isFixed, output, messages } = await linter.verifyAndFix(linterOptions);
      if (isFixed) {
        await writeFile(linterOptions.filePath, output, { encoding: 'utf-8' });
      }
      fileResults = messages;
    } else {
      fileResults = await linter.verify(linterOptions);
    }

    if (options.updateTodo) {
      linter.updateTodo(linterOptions, fileResults, options.todoConfig, options.isOverridingConfig);
    }

    fileResults = linter.processTodos(
      linterOptions,
      fileResults,
      options.todoConfig,
      options.fix || options.cleanTodo,
      options.isOverridingConfig
    );

    return {
      filePath,
      results: fileResults,
    };
  }

  // Use processWithPool to process files in parallel within the worker
  return await processWithPool(filePaths, 10, processFile);
}

// Start processing and send results back to main thread
processFiles()
  .then((results) => {
    parentPort.postMessage(results);
  })
  .catch((error) => {
    throw error;
  });
