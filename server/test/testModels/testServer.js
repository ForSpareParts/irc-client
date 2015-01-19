/**
 * Test the Server model.
 */

var Server = require('../../models/server');

describe('The Server model', function() {

  it('should strip the "connection" key off of a model from Ember', function() {
    var server = Server.fromEmber({
      server: {
        name: 'test server',
        host: 'irc.server.net',
        port: 6667,
        nick: 'myNick',
        connection: 1
      }
    });

    assert.isUndefined(server.get('connection'));
  });

});