import Rule from './_base.js';

let outro = `In HTML, all attributes are valid, but 'className' doesn't do anything.`;

function message(name) {
  switch (name) {
    case 'className': {
      return `Attribute, ${name}, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. ${outro}`;
    }

    default: {
      return `Attribute, ${name}, is probably unintended. ${outro}`;
    }
  }
}

export const camelCaseAttributes = [
  'acceptCharset',
  'accessKey',
  'allowFullScreen',
  'allowTransparency',
  'autoComplete',
  'autoFocus',
  'autoPlay',
  'cellPadding',
  'cellSpacing',
  'charSet',
  'className',
  'contentEditable',
  'contextMenu',
  'crossOrigin',
  'dataTime',
  'encType',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'frameBorder',
  'httpEquiv',
  'inputMode',
  'keyParams',
  'keyType',
  'noValidate',
  'marginHeight',
  'marginWidth',
  'maxLength',
  'mediaGroup',
  'minLength',
  'radioGroup',
  'readOnly',
  'rowSpan',
  'spellCheck',
  'srcDoc',
  'srcSet',
  'tabIndex',
  'useMap',
];

export default class NoJSXAttributes extends Rule {
  visitor() {
    return {
      AttrNode(path) {
        let isJSXProbably = camelCaseAttributes.includes(path.name);

        if (!isJSXProbably) {
          return;
        }

        this.log({
          message: message(path.name),
          node: path,
        });
      },
    };
  }
}
