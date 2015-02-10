/**
 * Test accessing IRC server connections through the API.
 */
var app = require('../../app')
  , request = require('supertest-as-promised')(app)
  , sinon = require('sinon');


var connectionLib = require('../../connection');
var Server = require('../../models/server');

var CONNECTION_PATH = NAMESPACE + '/servers/1/connection';
var CONNECTION_JSON = {
  connection: {
    id: 1,
    connected: false,
    server: 1,
    joined: []
  }
};

var clone;


describe('The connection API', function() {

  beforeEach(function() {
    //clear out all connection information between tests
    connectionLib.clearConnections();

    clone = JSON.parse(JSON.stringify(CONNECTION_JSON));
  });

  it('should show a summary of a connection', function() {
    return request.get(CONNECTION_PATH)

    .expect(200)
    .expect(CONNECTION_JSON);
  });

  it('should show all connections', function() {
    return request.get(NAMESPACE + '/connections')

    .expect(200)
    .then(function(res) {
      assert.strictEqual(res.body.connections.length, 2);
    });
  });

  it('should make a connection available from /connections/:id as well',
    function() {
      return request.get(NAMESPACE + '/connections/1')

      .expect(200)
      .expect(CONNECTION_JSON);
    }
  );

  it('should 405 for non-GET/PATCH requests to the connection root', function() {
    return request.post(CONNECTION_PATH)
    .send({})

    .expect(405);
  });

  it('should connect when we set connected to true', function() {
    clone.connection.connected = true;

    return request.patch(CONNECTION_PATH)
    .send({
      connection: {
        connected: true
      }
    })
    .expect(200)
    .expect(clone);
  });

  //when already connected
  describe('when servers are already connected,', function() {
    beforeEach(function() {
      //start with a couple joined channels
      clone.connection.joined = ['#channelA', '#channelB'];
      clone.connection.connected = true;

      return request.patch(CONNECTION_PATH)
      .send(clone);

    });

    it('should disconnect when we set connected to false', function() {
      clone.connection.connected = false;

      return request.patch(CONNECTION_PATH)
      .send(clone)

      .expect(200)
      .expect(clone);
    });

    it('should list joined channels', function() {
      return request.get(CONNECTION_PATH)

      .expect(200)
      .expect(clone);
    });

    it('should replace all joined channels on a PATCH', function() {
      clone.connection.joined = ['#channelB', '#channelC'];

      return request.patch(CONNECTION_PATH)
      .send(clone)
      .expect(200)
      .expect(clone);
    });

    it('should not attemp to reconnect if sent {connect: true}', function() {
      var callback = sinon.spy();

      return Server.get(1)
      
      .then(function(server) {
        server.connection().client.on('registered', function() {
          callback();
        });

        return request.patch(CONNECTION_PATH)
        .send(clone)
        .expect(200)
        .expect(clone);
      })

      .then(function() {
        assert.isFalse(callback.called);
      });
    });

  });

});
