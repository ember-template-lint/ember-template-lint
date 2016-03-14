/*jshint node:true*/
module.exports = {
  description: 'Generate default configuration for ember-cli-template-lint.',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  }
};
