import fs from 'node:fs';
import { createRequire } from 'node:module';
import url from 'node:url';

import Linter from '../linter.js';

const require = createRequire(import.meta.url);

function getResultLevel(message) {
  if (message.fatal || message.severity === 2) {
    return 'error';
  }
  return 'warning';
}

/**
 * This printer is heavily based on Microsoft's SARIF formatter for ESLint.
 * https://github.com/microsoft/sarif-sdk/blob/main/src/ESLint.Formatter/sarif.js
 */
export default class SarifFormatter {
  defaultFileExtension = 'sarif';

  constructor(options = {}) {
    this.options = options;
  }

  format(results) {
    return JSON.stringify(this.buildSarifLog(results), null, 2);
  }

  buildSarifLog(results) {
    const version = require('../../package.json').version;
    const sarifLog = {
      version: '2.1.0',
      $schema: 'http://json.schemastore.org/sarif-2.1.0-rtm.5',
      runs: [
        {
          tool: {
            driver: {
              name: 'ember-template-lint',
              informationUri: 'https://github.com/ember-template-lint/ember-template-lint',
              rules: [],
              version,
            },
          },
        },
      ],
    };
    const sarifFiles = {};
    const sarifArtifactIndices = {};
    let nextArtifactIndex = 0;
    const sarifRules = {};
    const sarifRuleIndices = {};
    let nextRuleIndex = 0;
    const sarifResults = [];
    const embedFileContents = this.options.verbose;

    const toolConfigurationNotifications = [];

    for (let filePath of Object.keys(results.files)) {
      let result = results.files[filePath];

      if (sarifFiles[result.filePath] === undefined) {
        sarifArtifactIndices[result.filePath] = nextArtifactIndex++;

        sarifFiles[result.filePath] = {
          location: {
            uri: url.pathToFileURL(result.filePath),
          },
        };

        if (embedFileContents) {
          // Try to get the file contents and encoding.
          const contents = fs.readFileSync(result.filePath, { encoding: 'utf-8' });

          sarifFiles[result.filePath].contents = {
            text: contents,
          };
          sarifFiles[result.filePath].encoding = 'utf-8';
        }

        let fileErrors = result.messages;
        let filteredMessages;

        if (fileErrors.length > 0) {
          let errorsFiltered = fileErrors.filter(
            (error) => error.severity === Linter.ERROR_SEVERITY
          );
          let warnings = this.options.quiet
            ? []
            : fileErrors.filter((error) => error.severity === Linter.WARNING_SEVERITY);
          let todos =
            this.options.quiet || !this.options.includeTodo
              ? []
              : fileErrors.filter((error) => error.severity === Linter.TODO_SEVERITY);

          filteredMessages = [...errorsFiltered, ...warnings, ...todos];

          for (const message of filteredMessages) {
            const sarifRepresentation = {
              level: getResultLevel(message),
              message: {
                text: message.message,
              },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: {
                      uri: url.pathToFileURL(result.filePath),
                      index: sarifArtifactIndices[result.filePath],
                    },
                  },
                },
              ],
            };

            if (message.rule && message.rule !== 'global') {
              sarifRepresentation.ruleId = message.rule;

              if (sarifRules[message.rule] === undefined) {
                sarifRuleIndices[message.rule] = nextRuleIndex++;

                // Create a new entry in the rules dictionary.
                sarifRules[message.rule] = {
                  id: message.rule,
                  helpUri: `https://github.com/ember-template-lint/ember-template-lint/blob/${version}/docs/rule/${message.rule}.md`,
                };
              }

              if (sarifRuleIndices[message.rule] !== 'undefined') {
                sarifRepresentation.ruleIndex = sarifRuleIndices[message.rule];
              }
            } else {
              // ember-template-lint produces a message with rule set to 'global' when it
              // encounters an internal error. SARIF represents this as a tool execution
              // notification rather than as a result, and a notification has a descriptor.id
              // property rather than a rule property.
              sarifRepresentation.descriptor = {
                id: 'ETL-NO-RULEID',
              };
            }

            if (message.line > 0 || message.column > 0) {
              sarifRepresentation.locations[0].physicalLocation.region = {};
              if (message.line > 0) {
                sarifRepresentation.locations[0].physicalLocation.region.startLine = message.line;
              }
              if (message.column > 0) {
                sarifRepresentation.locations[0].physicalLocation.region.startColumn =
                  message.column;
              }
            }

            if (message.source) {
              // Create an empty region if we don't already have one from the line / column block above.
              sarifRepresentation.locations[0].physicalLocation.region =
                sarifRepresentation.locations[0].physicalLocation.region || {};
              sarifRepresentation.locations[0].physicalLocation.region.snippet = {
                text: message.source,
              };
            }

            if (message.rule) {
              sarifResults.push(sarifRepresentation);
            } else {
              toolConfigurationNotifications.push(sarifRepresentation);
            }
          }
        }
      }
    }

    if (Object.keys(sarifFiles).length > 0) {
      sarifLog.runs[0].artifacts = [];

      for (const path of Object.keys(sarifFiles)) {
        sarifLog.runs[0].artifacts.push(sarifFiles[path]);
      }
    }

    // Per the SARIF spec §3.14.23, run.results must be present even if there are no results.
    // This provides a positive indication that the run completed and no results were found.
    sarifLog.runs[0].results = sarifResults;

    if (toolConfigurationNotifications.length > 0) {
      sarifLog.runs[0].invocations = [
        {
          toolConfigurationNotifications,
          executionSuccessful: true,
        },
      ];
    }

    if (Object.keys(sarifRules).length > 0) {
      for (const ruleId of Object.keys(sarifRules)) {
        let rule = sarifRules[ruleId];
        sarifLog.runs[0].tool.driver.rules.push(rule);
      }
    }

    return sarifLog;
  }
}
