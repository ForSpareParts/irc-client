var models = require('../models');
var modelRestRouter = require('./common').modelRestRouter;
var Server = require('./server').Server;

module.exports.Server = Server;
module.exports.Channel = modelRestRouter(models.Channel);
module.exports.User = modelRestRouter(models.User);
module.exports.Message = modelRestRouter(models.Message);
