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

// verbose logging when we are starting the server

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
      utilities.addData(rep);
      setInterval(function(){
        utilities.addData(rep);
      }, 60*60*1000);
    })
})
mediator.on('elasticClient.error', (err) => {
  console.error(err)
})

// we load the connection to the repository
db.connect(config.dbSettings, mediator)
// init the repository connection, and the event listener will handle the rest
mediator.emit('boot.ready')
