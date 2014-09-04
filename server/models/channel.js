var BaseModel = require('./common').BaseModel;

/** Represents an IRC channel or direct-message conversation. */
var Channel = BaseModel.extend({
  tableName: 'channel',

  //name (string)

 /** The Server on which this Channel exists. */
  server: function() {
    return this.belongsTo(Server);
  },

  /** All Users currently in this Channel. */
  users: function () {
    return this.belongsToMany(User);
  },
  
  /** All Messages sent in this Channel. */
  messages: function() {
    return this.hasMany(Message);
  }
});

module.exports = Channel;
