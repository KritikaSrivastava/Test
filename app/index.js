'use strict'

// we load all the depencies we need
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/respository.js')
const config = require('./config/config.js')
const db = require('./config/db.js')
const utilities = require('./utilities.js');
var request = require('request')
const mediator = new EventEmitter()


// log unhandled execpetions
process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})
process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

// event listener when the repository has been connected
mediator.on('elasticClient.ready', (elasticClient) => {
  let rep
  repository.connect(elasticClient)
    .then(repo => {
      rep = repo;
      console.log(`Elastic server Engine Connected,running on port: ${config.dbSettings.hosts}`)
      return server.start({
        port: config.serverSettings.port,
        repo
      })
    })
    .then(app => {
      console.log(`Server started succesfully, running on port: ${config.serverSettings.port}.`)
      //fetching the data from the external API and storing in the elastic search engine
      utilities.addData(rep);

      //fectches data from the external api hourly in case the product has increased or if there has been an update.
      setInterval(function(){
        utilities.addData(rep);
      }, 60*60*1000);
    })
})

//event listener when the repository is not connected
mediator.on('elasticClient.error', (err) => {
  console.error(err)
})

// we load the connection to the repository
db.connect(config.dbSettings, mediator)

// init the repository connection, and the event listener will handle the rest
mediator.emit('boot.ready')
