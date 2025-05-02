import Rule from './_base.js';

export default class NoLinkToPositionalParams extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        this.process(node, { hasRequiredTextParam: true });
      },

      BlockStatement(node) {
        this.process(node, { hasRequiredTextParam: false });
      },
    };
  }

  process(node, options) {
    if (node.path.original === 'link-to' && node.params.length > 0) {
      let message = this.getMessage(node, options);

      this.log({ message, node });
    }
  }

  getMessage(node, { hasRequiredTextParam }) {
    let requiredParamsCount = hasRequiredTextParam ? 2 : 1; // Route name is always required, text only for inline `{{link-to}}` components.
    let hasQueryParams = includesQueryParams(node.params);
    let modelParamsCount = countModelParams(node.params, requiredParamsCount, hasQueryParams);
    let namedArguments = ['`route`'];
    let additionalInfo = '';

    if (modelParamsCount === 1) {
      namedArguments.push('`model`');
    } else if (modelParamsCount > 1) {
      namedArguments.push('`models`');
    }

    if (hasQueryParams) {
      namedArguments.push('`query` using the `hash` helper');
    }

    if (hasRequiredTextParam) {
      additionalInfo = ' The content should be passed along as a block.';
    }

    return getErrorMessage(namedArguments.join(', '), additionalInfo);
  }
}

function includesQueryParams(params) {
  return params.some((param) => {
    return param.path && param.path.original === 'query-params';
  });
}

function countModelParams(params, requiredCount, hasQueryParams) {
  return Math.max(params.length - (hasQueryParams ? requiredCount + 1 : requiredCount), 0);
}

function getErrorMessage(namedArguments, additionalInfo) {
  return `Invoking the \`{{link-to}}\` component with positional arguments is deprecated. Instead, please use the equivalent named arguments (${namedArguments}).${additionalInfo}`;
}
