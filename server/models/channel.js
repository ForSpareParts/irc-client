var Promise = require('bluebird');

var modelsCommon = require('./common');

var BaseModel = modelsCommon.BaseModel;
var Bookshelf = modelsCommon.Bookshelf;

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

  virtuals: {
    links: function() {
      return {
        messages: '/api/channels/' + this.get('id') + '/messages'
      }
    }
  }
},
{ //class methods/properties
  foreignKeysTo: ['server']
});

module.exports = Channel;
