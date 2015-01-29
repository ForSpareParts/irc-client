var Promise = require('bluebird');

var modelsCommon = require('./common');
var Message = require('./message');

var BaseModel = modelsCommon.BaseModel;

/** Represents an IRC channel or direct-message conversation. */
var Channel = BaseModel.extend({
  tableName: 'channel',

  //name (string)

 /** The Server on which this Channel exists. */
  server: function() {
    return this.belongsTo('Server');
  },
  
  /** All Messages sent in this Channel. */
  messages: function() {
    return this.hasMany('Message');
  },

  /**
   * Send messageContents to this Channel, then persist in a Message.
   * @param  {string} messageContents
   * @return {Promise}
   */
  say: function(messageContents) {
    var self = this;
    return this.related('server').fetch()

    .then(function(server) {
      var connection = server.connection();

      if (!connection.isConnected()) {
        throw new Error("Cannot speak while offline.");
      }

      if (connection.getJoinedChannels().indexOf(self.get('name')) === -1) {
        throw new Error("Cannot speak without joining channel.");
      }

      connection.say(self.get('name'), messageContents);

      return Message.create({
        contents: messageContents,
        time: new Date(),
        nick: server.get('nick'),

        channel_id: self.get('id')
      });
    });
  },

  virtuals: {
    links: function() {
      return {
        messages: '/api/channels/' + this.get('id') + '/messages'
      };
    }
  }
},
{ //class methods/properties
  foreignKeys: ['server']
});

module.exports = Channel;
