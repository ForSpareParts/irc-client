import Ember from 'ember';

/**
 * Joins channelName on serverName through the UI.
 */
export default Ember.Test.registerAsyncHelper('joinChannel',
  function(app, channelName, serverName) {
    click('#join-channel-button');
    fillIn('#channel-name', channelName);
    fillIn('#channel-server-name', serverName);
    return click('#channel-save-button');
});
