import isValidConfigObjectFormat from '../../../lib/helpers/is-valid-config-object.js';

const POSSIBLE_CONFIG = { order: ['add', 'subtract', 'multiply', 'divide'] };

describe('isValidConfigObjectFormat', function () {
  it('checks that config must not be null or undefined', function () {
    expect(isValidConfigObjectFormat(null)).toBe(false);
    expect(isValidConfigObjectFormat(undefined)).toBe(false);
  });

  it('checks that property array values must be a subset of possible values', function () {
    expect(isValidConfigObjectFormat({ order: ['add'] }, POSSIBLE_CONFIG)).toBe(true);
  });

  it('checks that all property array values must be a subset of possible values', function () {
    expect(isValidConfigObjectFormat({ order: ['add', 'modulo'] }, POSSIBLE_CONFIG)).toBe(false);
  });

  it('checks that property names must be a subset of possible names', function () {
    expect(isValidConfigObjectFormat({ order: {} }, POSSIBLE_CONFIG)).toBe(true);
    expect(isValidConfigObjectFormat({ border: {} }, POSSIBLE_CONFIG)).toBe(false);
  });

  it('checks that all property names must be a subset of possible names', function () {
    expect(isValidConfigObjectFormat({ order: {}, border: {} }, POSSIBLE_CONFIG)).toBe(false);
  });

  it('checks that config can be a boolean', function () {
    expect(isValidConfigObjectFormat(true)).toBe(true);
    expect(isValidConfigObjectFormat(false)).toBe(true);
  });
});
