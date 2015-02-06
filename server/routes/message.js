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

router.canCreate = function(req) {
  if (!req.channel && !req.body.message.channel) {
    return {
      status: 400,
      message: 'Messages must have a Channel.'
    };
  }

  if (req.body.message.channel && req.channel &&
      req.body.message.channel.get('id') !== req.channel) {
    return {
      status: 400,
      message: ('The Channel in the URL does not match the one in the ' +
        'request body.')
    };
  }

  if (!req.body.message.channel) {
    //this means there's only a channel specified in the URL
    //snag it for the model
    req.body.message.channel = req.channel.get('id');
  }

  return true;
};

router.createRecord = function(req, res, next) {
  var message = models.Message.fromEmber(req.body);
  var channel;
  var server;

  return message.related('channel').fetch()

  .then(function(fetchedChannel) {
    channel = fetchedChannel;
    return channel.related('server').fetch();
  })

  .then(function(fetchedServer) {
    server = fetchedServer;

    if (message.get('nick') && server.get('nick') !== message.get('nick')) {
      throw ({
        status: 400,
        message: 'You can only send a message from your own nick'
      });
    }

    return channel.say(message.get('contents'));
  })

  .then(function(createdMessage) {
    res.send(createdMessage.toEmber());
  })

  .catch(function(reason) {
    next(reason);
  });
};

module.exports = router;
