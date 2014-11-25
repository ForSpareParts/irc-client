//router for servers and related models
var models = require('../models');

var channelsRouter = require('./channel');
var connectionRouter = require('./connection')
var modelRestRouter = require('./common').modelRestRouter;



var router = modelRestRouter(models.Server);
router.use('/:id/connection', connectionRouter);
router.use('/:id/channels', channelsRouter);

module.exports = router;