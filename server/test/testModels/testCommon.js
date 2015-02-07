/**
 * Test the base data model.
 */

var models = require('../../models');

describe('The base model', function() {
  it('should convert to and from the Ember JSON format', function() {
    var sampleEmber = {
      server: {
        name: 'some name',
        host: 'irc.hostname.net',
        port: '3000',
        links: {
          channels: '/api/servers/undefined/channels',
          connection: '/api/servers/undefined/connection'
        }
      }
    };

    var convertedToModel = models.Server.fromEmber(sampleEmber);

    //make sure the data made it into the model
    equal(
      convertedToModel.get('name'),
      sampleEmber.server.name);

    var backToEmber = convertedToModel.toEmber();

    assert.deepEqual(
      backToEmber,
      sampleEmber);


    //test plurals
    var sampleEmberArray = {
      servers: [
        {
          name: 'name one',
          host: 'irc.hostone.net',
          port: '3000',
          links: {
            channels: '/api/servers/undefined/channels',
            connection: '/api/servers/undefined/connection'
          }
        },
        {
          name: 'name two',
          host: 'irc.hosttwo.net',
          port: '3001',
          links: {
            channels: '/api/servers/undefined/channels',
            connection: '/api/servers/undefined/connection'
          }
        }
      ]
    };

    var convertedToModelArray = models.Server.fromEmberArray(sampleEmberArray);

    equal(
      convertedToModelArray.length,
      2);
    equal(
      convertedToModelArray[0].get('name'),
      'name one');
    equal(
      convertedToModelArray[1].get('host'),
      'irc.hosttwo.net');

    var backToEmberArray = models.Server.toEmberArray(convertedToModelArray);

    assert.deepEqual(
      backToEmberArray,
      sampleEmberArray);

  });

  it('should strip "_id" from foreign keys when converting to Ember format',
    function() {
      return models.Channel.get(1)

      .then(function(channel) {
        emberObj = channel.toEmber();

        assert.property(emberObj.channel, "server");
        assert.notProperty(emberObj.channel, "server_id");
      });
  });

  it('should add "_id" back on to foreign keys when converting from Ember '
    +'format', function() {
      var record = models.Message.fromEmber({
        message: {
          channel: 1,

          contents: "foobar",
          time: new Date().toISOString(),
          nick: "someUser"
        }
      });

      equal(record.attributes.contents, 'foobar');
      equal(record.attributes.channel_id, 1);
    });
});
