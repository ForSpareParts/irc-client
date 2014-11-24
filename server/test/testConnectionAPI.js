/**
 * Test accessing IRC server connections through the API.
 */
var app = require('../app')
  , request = require('supertest-as-promised')(app);

var connectionLib = require('../connection');

var CONNECTION_PATH = '/servers/1/connection';

describe('The connection API', function() {

  beforeEach(function() {
    //clear out all connection information between tests
    connectionLib.clearConnections();
  });

  it('should show a summary of a connection', function() {
    return request.get(CONNECTION_PATH)

    .expect(200)
    .expect({connected: false, server: 1, joined: []});
  });

  it('should show connection state at /connected', function() {
    return request.get(CONNECTION_PATH + '/connected')

    .expect(200)
    .expect({connected: false});
  });

  it('should connect when we set /connected to true', function() {
    return request.post(CONNECTION_PATH + '/connected')
    .send({connected: true})
    .expect(200)
    .expect({connected: true})
  });

  //when already connected
  describe('when servers are already connected,', function() {
    beforeEach(function() {

      //start with a couple joined channels
      return request.post(CONNECTION_PATH + '/joined')
      .send({joined: ['#channelA', '#channelB']});

    });

    it('should disconnect when we set /connected to false', function() {
      return request.post(CONNECTION_PATH + '/connected')
      .send({connected: false})

      .expect(200)
      .expect({connected: false});
    });

    it('should list joined channels at /joined', function() {
      return request.get(CONNECTION_PATH + '/joined')

      .expect(200)
      .expect({joined: ['#channelA', '#channelB']});
    });

    it('should replace all joined channels on a POST to /joined', function() {
      return request.post(CONNECTION_PATH + '/joined')
      .send({joined: ['#channelB', '#channelC']})
      .expect(200)
      .expect({joined: ['#channelB', '#channelC']});
    });

    it('should add joined channels on a PUT to /joined', function() {
      return request.put(CONNECTION_PATH + '/joined')
      .send({joined: ['#channelB', '#channelC']})
      .expect(200)
      .expect({joined: ['#channelA', '#channelB', '#channelC']});
    });

  });

});
