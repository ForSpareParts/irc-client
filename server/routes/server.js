var modelRestRouter = require('./common').modelRestRouter;
var models = require('../models');

module.exports.Server = modelRestRouter(models.Server);
