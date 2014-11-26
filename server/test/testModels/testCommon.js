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
          channels: '/api/servers/undefined/channels'
        }
      }
    }

    var convertedToModel = models.Server.fromEmber(sampleEmber);

    //make sure the data made it into the model
    assert.strictEqual(
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
            channels: '/api/servers/undefined/channels'
          }
        },
        {
          name: 'name two',
          host: 'irc.hosttwo.net',
          port: '3001',
          links: {
            channels: '/api/servers/undefined/channels'
          }
        }
      ]
    };

    var convertedToModelArray = models.Server.fromEmberArray(sampleEmberArray);

    assert.strictEqual(
      convertedToModelArray.length,
      2);
    assert.strictEqual(
      convertedToModelArray[0].get('name'),
      'name one');
    assert.strictEqual(
      convertedToModelArray[1].get('host'),
      'irc.hosttwo.net');

    var backToEmberArray = models.Server.toEmberArray(convertedToModelArray);

    assert.deepEqual(
      backToEmberArray,
      sampleEmberArray);

  });
});