import { Entity, Property } from '../dist/antity';

const validProps = () => [
  {
    key: 'id',
    type: 'integer',
    min: 1,
    max: 999999999,
    isTypeChecked: true,
    requiredFor: [],
    isPrivate: false,
    sanitizer: null,
    normalizer: null,
    validator: null
  }
];

describe('Property constructor validation', () => {
  it('should throw when key is not a non-empty string', () => {
    expect(() => new Property('', 'string', 0, 10, false, [], false, false, null, null, null)).toThrow();
  });

  it('should throw when type is not a valid type', () => {
    expect(() => new Property('name', 'notAType', 0, 10, false, [], false, false, null, null, null)).toThrow();
  });

  it('should throw when requiredFor is provided but is not an array', () => {
    expect(() => new Property('name', 'string', 0, 10, false, 'POST', false, false, null, null, null)).toThrow();
  });

  it('should throw when requiredFor contains an invalid REST method', () => {
    expect(() => new Property('name', 'string', 0, 10, false, ['FETCH'], false, false, null, null, null)).toThrow();
  });

  it('should throw when a date bound is provided but is not a valid Date', () => {
    expect(() => new Property('startDate', 'date', 'not-a-date', null, false, [], false, false, null, null, null)).toThrow();
  });

  it('should not throw when a date bound is omitted (null)', () => {
    expect(() => new Property('startDate', 'date', null, null, false, [], false, false, null, null, null)).not.toThrow();
  });
});

describe('Entity constructor validation', () => {
  it('should throw when name is an empty string', () => {
    expect(() => new Entity('', validProps())).toThrow();
  });

  it('should throw when properties is not an array', () => {
    expect(() => new Entity('users', 'not-an-array')).toThrow();
  });

  it('should accept a valid name and properties array', () => {
    expect(() => new Entity('users', validProps())).not.toThrow();
  });
});
