import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-iframe-src-attribute',

  config: true,

  good: [
    '<iframe src="about:blank"></iframe>',
    '<iframe src="/safe-path" {{this.setFrameElement}}></iframe>',
    '<iframe src="data:text/html,<h1>safe</h1>"></iframe>',
    '<iframe src=""></iframe>',
  ],

  bad: [
    {
      template: '<iframe {{this.setFrameElement}}></iframe>',
      fixedTemplate: '<iframe src="about:blank" {{this.setFrameElement}}></iframe>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 0,
     "endColumn": 42,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "Security Risk: \`<iframe>\` must include a static \`src\` attribute. Otherwise, CSP \`frame-src\` is bypassed and \`about:blank\` inherits parent origin, creating an elevated-privilege frame.",
     "rule": "require-iframe-src-attribute",
     "severity": 2,
     "source": "<iframe {{this.setFrameElement}}></iframe>",
   },
 ]
          `);
      },
    },
    {
      template: '<iframe></iframe>',
      fixedTemplate: '<iframe src="about:blank"></iframe>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 0,
     "endColumn": 17,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "Security Risk: \`<iframe>\` must include a static \`src\` attribute. Otherwise, CSP \`frame-src\` is bypassed and \`about:blank\` inherits parent origin, creating an elevated-privilege frame.",
     "rule": "require-iframe-src-attribute",
     "severity": 2,
     "source": "<iframe></iframe>",
   },
 ]
          `);
      },
    },
    {
      template: '<iframe ...attributes id="foo"></iframe>',
      fixedTemplate: '<iframe ...attributes id="foo" src="about:blank"></iframe>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 0,
     "endColumn": 40,
     "endLine": 1,
     "filePath": "layout.hbs",
     "isFixable": true,
     "line": 1,
     "message": "Security Risk: \`<iframe>\` must include a static \`src\` attribute. Otherwise, CSP \`frame-src\` is bypassed and \`about:blank\` inherits parent origin, creating an elevated-privilege frame.",
     "rule": "require-iframe-src-attribute",
     "severity": 2,
     "source": "<iframe ...attributes id="foo"></iframe>",
   },
 ]
          `);
      },
    },
  ],
});
