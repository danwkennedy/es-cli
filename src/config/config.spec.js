const { assert } = require('chai');
const Config = require('./config');

describe(`Configuration`, () => {

  describe(`getClient()`, () => {
    it(`returns a promise`, () => {
      let config = new Config({
        connection: {
          hosts: [],
          version: '2.3'
        }
      });

      assert.instanceOf(config.getClient(), Promise);
    });

    it(`resolves the config's getClient()`, () => {
      let config = new Config({
        getClient: () => ({ isClient: true })
      });

      return config.getClient().then(client => {
        assert.isTrue(client.isClient);
      });
    });

    it(`resolves the a new ES client if the connection`, () => {
      let config = new Config({
        connection: {
          hosts: ['localhost:9200'],
          apiVersion: '2.3'
        }
      });

      return config.getClient().then(client => {
        assert.deepEqual(client.transport._config.hosts, ['localhost:9200']);
      });
    });
  });

  describe(`getIndexes`,() => {
    it(`returns the configured indexes`, () => {
      let indexes = [{
        alias: 'some-alias'
      }];
      let config = new Config({
        indexes: indexes
      });

      assert.equal(config.getIndexes(), indexes);
    });
  });

  describe(`getIndex`, () => {
    it(`returns an index by alias name`, () => {
      let indexes = [{
        alias: 'some-alias'
      }, {
        alias: 'other-alias'
      }];

      let config = new Config({
        indexes: indexes
      });

      assert.equal(config.getIndex('other-alias'), indexes[1])
    });
  });

});
