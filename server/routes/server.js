//router for servers and related models
var models = require('../models');

var channelsRouter = require('./channel');
var connectionRouter = require('./connection');
var modelRestRouter = require('./common').modelRestRouter;



var router = modelRestRouter(models.Server);

//can only edit or delete when we're not actually connected
router.canEdit = function(req) {
  if (!req.server.connection().isConnected()){
    return true;
  }

  return {
    status: 403,
    message: 'Cannot edit or delete a Server while it\'s connected'
  };
};

router.use('/:id/connection', connectionRouter);
router.use('/:id/channels', channelsRouter);

module.exports = router;
