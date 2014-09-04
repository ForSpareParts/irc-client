var BaseModel = require('./common').BaseModel;

/** Represents a user on a Server. The User representing us on a particular
Server is stored on the Server model as the connectionUser.*/
var User = BaseModel.extend({

  tableName: 'user',

  //nickname (string)

  /** The Server on which this User exists. */
  server: function() {
    return this.belongsTo('Server');
  },

  /** The Channels to which this User belongs. */
  channels: function () {
    return this.belongsToMany('Channel');
  }
});

module.exports = User;