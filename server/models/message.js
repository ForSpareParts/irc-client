var BaseModel = require('./common').BaseModel;

/** Represents a message in a Channel */
var Message = BaseModel.extend({

  tableName: 'message',

  // contents (string)
  // time (string, ISO-formatted -- SQLite doesn't have native DATETIME columns)
  // type (string, empty [for normal message], or 'join', 'part')
  // nick (string)

  /** The Channel in which this Message was sent. */
  channel: function() {
    return this.belongsTo('Channel');
  },

  toJSON: function() {
    var jsonObj = BaseModel.prototype.toJSON.apply(this);

    jsonObj.time = new Date(jsonObj.time).toISOString();

    return jsonObj;
  }
},
{ //class methods/properties
  foreignKeys: ['channel']
});

module.exports = Message;
