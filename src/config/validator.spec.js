const assert = require('chai').assert;
const validator = require('./validator');

describe(`Config validator`, () => {

  it(`checks that at least a connection or a client getter is set`, () => {
    let config = {
      indexes: []
    };

    assert.throws(() => { validator.validate(config) }, 'ValidationError');
  });

  it(`throws for invalid fields`, () => {
    let config = { };

    assert.throws(() => { validator.validate(config) }, 'ValidationError');
  });

  it(`returns true if the config is valid`, () => {
    let config = {
      indexes: [],
      connection: {
        hosts: ['localhost:9200'],
        version: '1.7'
      }
    };

    assert.isTrue(validator.validate(config));
  });

});
