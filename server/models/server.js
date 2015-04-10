var connectionLib = require('../connection');
var modelsCommon = require('./common');

var BaseModel = modelsCommon.BaseModel;

/**
Represents an IRC server.
*/
var Server = BaseModel.extend({
  tableName: 'server',

  //name (string)
  //host (string)
  //port (string)
  //nick (string)

  //unqiue together: host, port

  /** All known Channels on the Server. */
  channels: function() {
    return this.hasMany('Channel');
  },

  /** Get the Connection object for this server. */
  connection: function() {
    return connectionLib.getConnection(
      this.get('host'),
      this.get('port'),
      this.get('nick'));
  },

  //this is like toJSON/toEmber() for a connection
  //we need it because connections don't really have IDs of their own, and
  //don't know anything about their servers.
  connectionJSON: function(wrap){
    if (wrap === undefined) {
      wrap = true;
    }

    var connection = this.connection();

    var innerData = {
      id: this.id,
      connected: connection.isConnected(),
      server: this.id,
      joined: connection.getJoinedChannels()
    };

    if (wrap) {
      return {
        connection: innerData
      };
    }

    return innerData;
  },

  virtuals: {
    links: function() {
      return {
        channels: '/api/servers/' + this.get('id') + '/channels',
        connection: '/api/servers/' + this.get('id') + '/connection'
      };
    }
  }
}, {
  fromEmber: function(emberObject) {
    //Ember really wants a "connection" key on there, we'll just strip it out so
    //that Bookshelf doesn't complain
    
    delete emberObject.server.connection;

    return BaseModel.fromEmber.bind(this)(emberObject);
  }
});

module.exports = Server;
