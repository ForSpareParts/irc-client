var BaseModel = require('./common').BaseModel;

/** Represents a message in a Channel */
var Message = BaseModel.extend({

  tableName: 'message',

  // contents (string)
  // time (string, ISO-formatted -- SQLite doesn't have native DATETIME columns)
  // nick (string)

  /** The Channel in which this Message was sent. */
  channel: function() {
    return this.belongsTo('Channel');
  }
});

module.exports = Message;
