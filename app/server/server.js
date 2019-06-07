'use strict'
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const request = require('request')
const movieAPI = require('../api/searchAPI')
const fs = require('fs')

const start = (options) => {
  return new Promise((resolve, reject) => {
    // we need to verify if we have a repository added and a server port
    if (!options.repo) {
      reject(new Error('The server must be started with a connected repository'))
    }
    if (!options.port) {
      reject(new Error('The server must be started with an available port'))
    }
    // let's init a express app, and add some middlewares
    const app = express()

    //logger modules helps to keep logs
    app.use(logger('dev'))
    app.use(logger('common', {
      stream: fs.createWriteStream('./access.log', {flags: 'a'})
    }));

    //the helpmet module is used for Security purposes
    app.use(helmet())
    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong!, err:' + err))
      res.status(500).send('Something went wrong!')
    })

    // we add our API's to the express app
    movieAPI(app, options)
    // finally we start the server, and return the newly created server
    const server = app.listen(options.port, () => resolve(server))
  })
}

module.exports = Object.assign({}, {start})
