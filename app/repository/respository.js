// repository.js
// factory function, that holds an open connection to the db,
// and exposes some functions for accessing the data.
const config = require('../config/config.js')
const repository = (elasticClient) => {


//function to add document to an index
  const addDocument = (payload) => {
    return new Promise((resolve, reject) => {
      elasticClient.index({
          index: config.elasticSearchSetting.index,
          type: config.elasticSearchSetting.type,
          body: payload,
          id:payload.productId
      },function (err,resp) {
        if (err) {
          reject(err.message);
        } else {
          resolve(resp);
          }
        });
    })
  }

//function to search a product in the Collection
  const search = (query) => {
    return new Promise((resolve, reject) => {
      elasticClient.search({
            size:config.elasticSearchSetting.size,
            index: config.elasticSearchSetting.index,
            type: config.elasticSearchSetting.type,
            body:query
        },function (err,resp) {
            if (err) {
              reject(err);
            }
            resolve(resp.hits.hits);
      });
    })
  }

//function to create an index
  const initIndex = () => {
    return new Promise((resolve, reject) => {
      elasticClient.indices.create({
          index: config.elasticSearchSetting.index
      },function (err,resp) {
        if (err) {
          reject(err.message);
        } else {
          resolve(resp);
          }
        });
    })
  }

//function to check if an index exists or not
  const indexExists = () => {
    return new Promise((resolve, reject) => {
      elasticClient.indices.exists({
          index: config.elasticSearchSetting.index
        },function (err,resp) {
          if (err) {
            //reject(err);
          } else {
            resolve(resp);
            }
      });
    })
  }

  return Object.create({
    addDocument,
    search,
    initIndex,
    indexExists
    })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    resolve(repository(connection))
  })
}
// this only exports a connected repo
module.exports = Object.assign({}, {connect})
