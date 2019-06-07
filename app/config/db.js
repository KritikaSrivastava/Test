var ElasticSearch = require('elasticsearch');


//  function to connect to the elastic search engine
//options contains database parameters and mediator is an event emitter
const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    var elasticClient = new ElasticSearch.Client ({host:options.hosts});
    elasticClient.ping({requestTimeout: 30000,}, function(err,resp) {
      if(err) {
        mediator.emit('elasticClient.error',err);
      }
      else {
        mediator.emit('elasticClient.ready',elasticClient);
      }
    });
  });
}

module.exports = Object.assign({}, {connect})
