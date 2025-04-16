import { IGNORE_SEVERITY, WARNING_SEVERITY, ERROR_SEVERITY } from './severity.js';

function _determineConfigForSeverity(config) {
  switch (config) {
    case 'off': {
      return { config: false, severity: IGNORE_SEVERITY };
    }
    case 'warn': {
      return { config: true, severity: WARNING_SEVERITY };
    }
    case 'error': {
      return { config: true, severity: ERROR_SEVERITY };
    }
  }
}

export default function determineRuleConfig(ruleData) {
  let ruleConfig = {
    severity: ruleData === false ? IGNORE_SEVERITY : ERROR_SEVERITY,
    config: ruleData,
  };
  let severityConfig;
  // In case of {'no-implicit-this': 'off|warn|error'}
  if (typeof ruleData === 'string') {
    severityConfig = _determineConfigForSeverity(ruleData);
    if (severityConfig) {
      ruleConfig = severityConfig;
    }
  } else if (Array.isArray(ruleData)) {
    // array of severity and custom rule config
    let severity = ruleData[0];
    severityConfig = _determineConfigForSeverity(severity);
    if (severityConfig) {
      ruleConfig.severity = severityConfig.severity;
      ruleConfig.config = ruleData[1];
    }
  }
  return ruleConfig;
}
