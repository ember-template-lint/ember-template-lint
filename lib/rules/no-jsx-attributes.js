import Rule from './_base.js';

let outro = `In HTML, all attributes are valid, but 'className' doesn't do anything.`;

function message(name) {
  switch (name) {
    case 'className': {
      return `Attribute, ${name}, does not assign the 'class' attribute as it would in JSX.  To assign the 'class' attribute, set the 'class' attribute, instead of 'className'. ${outro}`;
    }

    default: {
      return `Incorrect html attribute name detected - "${name}", is probably unintended. Attributes in HTML are kebeb case.`;
    }
  }
}

const fixMap = {
  acceptCharset: 'accept-charset',
  srcSet: 'srcset',
  accessKey: 'accesskey',
  allowFullScreen: 'allowfullscreen',
  allowTransparency: 'allowtransparency',
  autoComplete: 'autocomplete',
  autoFocus: 'autofocus',
  autoPlay: 'autoplay',
  cellPadding: 'cellpadding',
  cellSpacing: 'cellspacing',
  charSet: 'charset',
  className: 'class',
  contentEditable: 'contenteditable',
  contextMenu: 'contextmenu',
  crossOrigin: 'crossorigin',
  dateTime: 'datetime',
  encType: 'enctype',
  formAction: 'formaction',
  formEncType: 'formenctype',
  formMethod: 'formmethod',
  formNoValidate: 'formnovalidate',
  formTarget: 'formtarget',
  frameBorder: 'frameborder',
  httpEquiv: 'http-equiv',
  inputMode: 'inputmode',
  keyType: 'keytype',
  noValidate: 'novalidate',
  marginHeight: 'marginheight',
  marginWidth: 'marginwidth',
  maxLength: 'maxlength',
  minLength: 'minlength',
  radioGroup: 'radiogroup',
  readOnly: 'readonly',
  rowSpan: 'rowspan',
  colSpan: 'colspan',
  spellCheck: 'spellcheck',
  srcDoc: 'srcdoc',
  tabIndex: 'tabindex',
  useMap: 'usemap',
};

export const camelCaseAttributes = Object.keys(fixMap);

export default class NoJSXAttributes extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoJSXAttributes>}
   */
  visitor() {
    return {
      AttrNode(path) {
        let key = path.name;
        let isJSXProbably = camelCaseAttributes.includes(key);

        if (!isJSXProbably) {
          return;
        }

        if (this.mode === 'fix' && fixMap[key]) {
          path.name = fixMap[key];
        } else {
          this.log({
            message: message(path.name),
            node: path,
            isFixable: Boolean(fixMap[key]),
          });
        }
      },
    };
  }
}
