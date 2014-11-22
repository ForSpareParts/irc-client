/**
 * Test accessing IRC server connections through the API.
 */
var app = require('../app')
  , request = require('supertest-as-promised')(app);

var connectionLib = require('../connection');

describe('The connection API', function() {

  beforeEach(function() {
    //clear out all connection information between tests
    connectionLib.clearConnections();
  });

  it('should show a summary of a connection', function() {
    return request.get('/connections/1')

    .expect(200)
    .expect({connected: false, server: 1, channels: []});
  });

  it('should show connection state at /connected', function() {
    return request.get('/connections/1/connected')

    .expect(200)
    .expect({connected: false});
  });

  it('should connect when we set /connected to true', function() {
    return request.post('/connections/1/connected')
    .send({connected: true})
    .expect(200)
    .expect({connected: true})
  });

  it('should 404 if we request a connection without a matching server',
    function() {
      return request.get('/connections/42/connected')
      .expect(404);
    })

  //when already connected
  describe('when servers are already connected,', function() {
    beforeEach(function() {

      //start with a couple joined channels
      return request.post('/connections/1/channels')
      .send({channels: ['#channelA', '#channelB']});

    });

    it('should disconnect when we set /connected to false', function() {
      return request.post('/connections/1/connected')
      .send({connected: false})

      .expect(200)
      .expect({connected: false});
    });

    it('should list joined channels at /channels', function() {
      return request.get('/connections/1/channels')

      .expect(200)
      .expect({channels: ['#channelA', '#channelB']});
    });

    it('should replace all joined channels on a POST to /channels', function() {
      return request.post('/connections/1/channels')
      .send({channels: ['#channelB', '#channelC']})
      .expect(200)
      .expect({channels: ['#channelB', '#channelC']});
    });

    it('should add joined channels on a PUT to /channels', function() {
      return request.put('/connections/1/channels')
      .send({channels: ['#channelB', '#channelC']})
      .expect(200)
      .expect({channels: ['#channelA', '#channelB', '#channelC']});
    });

  });

});
