var models = require('../models');
var modelRestRouter = require('./common').modelRestRouter;

module.exports.Server = require('./server');
module.exports.Channel = require('./channel');
module.exports.User = modelRestRouter(models.User);
module.exports.Message = modelRestRouter(models.Message);
