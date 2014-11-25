//router for servers and related models
var models = require('../models');

var messagesRouter = require('./message');
var modelRestRouter = require('./common').modelRestRouter;


var router = modelRestRouter(models.Channel);
router.getCollection = function(req) {
  //if we've already retrieved a server, we filter to get only its channels
  if (req.server !== undefined) {
    return models.Channel.collection().query(function(qb) {
      qb.where({server_id: req.server.get('id')});
    });
  }

  //otherwise, we get all the channels in the database
  return models.Channel.collection();
};


router.use('/:id/messages', messagesRouter);

module.exports = router;
