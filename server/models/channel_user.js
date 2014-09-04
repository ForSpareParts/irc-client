var BaseModel = require('./common').BaseModel;

/** Represents records in the Channel<->User many-to-many relationship. Real
code will rarely use this model, but it's useful for fixture creation.*/
var ChannelUser = BaseModel.extend({
  tableName: 'channel_user',

  channel: function() {
    this.belongsTo(Channel);
  },

  user: function() {
    this.belongsTo(User);
  }
});

module.exports = ChannelUser;
