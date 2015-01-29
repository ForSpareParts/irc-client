//router for servers and related models
var models = require('../models');

var modelRestRouter = require('./common').modelRestRouter;

var router = modelRestRouter(models.Message);

router.getCollection = function(req) {
  //if we've already retrieved a channel, we filter to get only its messages
  if (req.channel) {
    return models.Message.collection().query(function(qb) {
      qb.where({channel_id: req.channel.get('id')});
    });
  }

  //otherwise, we get all the messages in the database
  return models.Message.collection();
};

router.canEdit = function(req) {
  return {
    status: 405,
    message: 'Cannot edit Messages after creation.'
  };
};

module.exports = router;
