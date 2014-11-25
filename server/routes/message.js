//router for servers and related models
var models = require('../models');

var connectionRouter = require('./connection')
var modelRestRouter = require('./common').modelRestRouter;

var router = modelRestRouter(models.Message);
router.getCollection = function(req) {
  //if we've already retrieved a server, we filter to get only its channels
  if (req.channel !== undefined) {
    return models.Message.collection().query(function(qb) {
      qb.where({channel_id: req.channel.get('id')});
    });
  }

  //otherwise, we get all the channels in the database
  return models.Message.collection();
};

module.exports = router;
