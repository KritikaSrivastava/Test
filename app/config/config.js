// simple configuration file

// database parameters
const dbSettings = {
  //db: process.env.DB || 'Products',
  hosts: process.env.DB_SERVER || 'localhost:9200'
}

// server parameters
const serverSettings = {
  port: process.env.PORT || 3000
}

//elasticsearch engine parameters
const elasticSearchSetting = {
  type:'Products',
  index:'practise-elasticsearch',
  size:1000
}

//external API parameters
const externalAPISetting = {
  url:'https://mobile-tha-server.firebaseapp.com/walmartproducts',
  pageNumber: 1,
  pageSize:30
}


module.exports = Object.assign({}, { dbSettings, serverSettings,elasticSearchSetting ,externalAPISetting})
