var BaseModel = require('./common').BaseModel;

/** Represents an IRC server. */
var Server = BaseModel.extend({
  tableName: 'server',

  //name (string)
  //host (string)
  //port (string)

  /** All known Channels on the Server. */
  channels: function() {
    return this.hasMany('Channel');
  },

  /** The User representing 'us' on the server. */
  connectionUser: function() {
    return this.belongsTo('User', 'connection_user_id');
  },

  /** All known Users on the server. */
  users: function() {
    return this.hasMany('User');
  }
});

module.exports = Server;
