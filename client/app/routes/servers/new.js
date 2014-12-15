import ServerEditRoute from '../server';

export default ServerEditRoute.extend({
  model: function() {
    return this.get('store').createRecord('server', {});
  }
});
