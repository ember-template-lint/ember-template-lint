import { parentPort } from 'node:worker_threads';
import Linter from './linter.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let linter;
let workingDir;

// Override console methods to forward output to main process
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug
};

console.log = (...args) => {
  parentPort.postMessage({ type: 'stdout', method: 'log', args });
  originalConsole.log(...args);
};

console.warn = (...args) => {
  parentPort.postMessage({ type: 'stdout', method: 'warn', args });
  originalConsole.warn(...args);
};

console.error = (...args) => {
  parentPort.postMessage({ type: 'stdout', method: 'error', args });
  originalConsole.error(...args);
};

console.info = (...args) => {
  parentPort.postMessage({ type: 'stdout', method: 'info', args });
  originalConsole.info(...args);
};

console.debug = (...args) => {
  parentPort.postMessage({ type: 'stdout', method: 'debug', args });
  originalConsole.debug(...args);
};

parentPort.on('message', async (message) => {
  const { type, options, fileBatch } = message;

  if (type === 'init') {
    workingDir = options.workingDir;
    // Ensure we're in the correct working directory
    process.chdir(workingDir);
    
    linter = new Linter({
      ...options,
      workingDir,
      // Ensure config paths are resolved relative to the working directory
      configPath: options.configPath ? path.resolve(workingDir, options.configPath) : options.configPath
    });
    
    parentPort.postMessage({ type: 'ready' });
    return;
  }

  if (type === 'lint') {
    try {
      const { results, todoAdded, todoRemoved } = await processFileBatch(fileBatch, options);
      
      parentPort.postMessage({ 
        type: 'results',
        results,
        todoAdded,
        todoRemoved
      });
    } catch (error) {
      parentPort.postMessage({ 
        type: 'error',
        error: error.message
      });
    }
  }
});

async function processFileBatch(fileBatch, options) {
  const results = [];
  let todoAdded = 0;
  let todoRemoved = 0;

  for (const fileInfo of fileBatch) {
    try {
      let fileResults;
      const { filePath, source } = fileInfo;
      
      // Ensure file paths are resolved relative to the working directory
      const resolvedFilePath = path.resolve(workingDir, filePath);
      
      if (options.fix) {
        const { isFixed, output, messages } = await linter.verifyAndFix({ 
          ...fileInfo, 
          source,
          filePath: resolvedFilePath
        });
        fileResults = messages;
        
        if (isFixed) {
          await fs.writeFile(resolvedFilePath, output, { encoding: 'utf-8' });
        }
      } else {
        fileResults = await linter.verify({ 
          ...fileInfo, 
          source,
          filePath: resolvedFilePath
        });
      }

      if (options.updateTodo) {
        const { addedCount, removedCount } = linter.updateTodo(
          { ...fileInfo, source, filePath: resolvedFilePath },
          fileResults,
          options.todoConfig,
          options.isOverridingConfig
        );

        todoAdded += addedCount;
        todoRemoved += removedCount;
      }

      if (!options.isStdin) {
        fileResults = linter.processTodos(
          { ...fileInfo, source, filePath: resolvedFilePath },
          fileResults,
          options.todoConfig,
          options.fix || options.cleanTodo,
          options.isOverridingConfig
        );
      }

      results.push(...fileResults);
    } catch (error) {
      results.push({
        rule: 'error',
        message: `Error processing ${filePath}: ${error.message}`,
        filePath,
        severity: 2,
        fatal: true
      });
    }
  }

  return { results, todoAdded, todoRemoved };
} 