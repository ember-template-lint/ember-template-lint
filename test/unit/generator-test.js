'use strict';

const fs = require('fs');
const path = require('path');

const helpers = require('yeoman-test');

const RulesIndexGenerator = require('../../dev/rules-index-generator');
const Project = require('../helpers/fake-project');

const ROOT = process.cwd();

if (Number(process.versions.node.split('.')[0]) > 10) {
  describe('generators', () => {
    let project = null;

    beforeEach(function () {
      project = new Project();
    });

    afterEach(async function () {
      process.chdir(ROOT);
      await project.dispose();
    });

    it('generates the rules index file correctly', async function () {
      jest.setTimeout(10000);
      project.writeSync();

      let rulesIndexPath = path.resolve(__dirname, '../../lib/rules');
      let expectedRulesIndex = fs.readFileSync(path.join(rulesIndexPath, 'index.js'), {
        encoding: 'utf-8',
      });

      await helpers.run(RulesIndexGenerator).cd(project.baseDir).withOptions({
        rulesIndexPath,
      });

      let generatedRulesIndex = fs.readFileSync(path.join(project.baseDir, 'lib/rules/index.js'), {
        encoding: 'utf-8',
      });

      expect(generatedRulesIndex).toEqual(expectedRulesIndex);
    });
  });
}
