const elasticsearch = require('elasticsearch');

module.exports = {
  indexes: [{
    alias: 'sales-record-rules',
    settings: {},
    mappings: {}
  }],
  connection: {
    hosts: [ 'http://ms-local.steadyserv.net:9200' ],
    version: '1.7'
  }
};
