module.exports = function setupEnvVar(name, value) {
  let oldValue;

  beforeEach(function () {
    oldValue = name in process.env ? process.env[name] : null;

    if (value === null) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  });

  afterEach(function () {
    if (oldValue === null) {
      delete process.env[name];
    } else {
      process.env[name] = oldValue;
    }
  });
};
