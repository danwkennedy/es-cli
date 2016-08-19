const elasticsearch = require('elasticsearch');

module.exports = class Configuration {

  constructor(config) {
    this.config = config;
  }

  getClient() {
    if (this.config.getClient) {
      return Promise.resolve(this.config.getClient());
    }

    let args = {
      hosts: this.config.connection.hosts,
      apiVersion: this.config.connection.version
    };

    return Promise.resolve( new elasticsearch.Client(args));
  }

  getIndexes() {
    return this.config.indexes;
  }

  getIndex(alias) {
    return this.getIndexes().find( index => {
      return index.alias === alias;
    })
  }
};
