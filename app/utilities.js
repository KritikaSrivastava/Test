// containing function to fetch data from external firebase API
//Also check whether the index exists or not. If it doesnt it creates one
var config = require('./config/config.js')
var request = require('request')

const addData = (repo) => {
  const url = config.externalAPISetting.url;
  let pageNumber = config.externalAPISetting.pageNumber;
  let pageSize = config.externalAPISetting.pageSize;

  //checks to see if the index exists or not. If it doesnt then it creates one
  repo.indexExists().then(data => {
    if(data == false) {
      repo.initIndex().then(data => {
        console.log('Index created');
      }).catch(function(err) {
        console.log(err);
      });
    }
  }).catch(function(err) {
    console.log(err);
  });

  //fetching the data from the external API in a loop and storing it in elastic search engine
  do {
  request(url + `/${pageNumber}` + `/${pageSize}`,
    function(err, res, body) {
      for(let i = 0; i < JSON.parse(body).products.length; i++) {
        var data = JSON.parse(body).products[i];
        var product = {"productId": data.productId,
            "productName": data.productName,
            "shortDescription": data.shortDescription,
            "longDescription": data.longDescription,
            "price": parseInt(data.price.substr(1),10),
            "productImage": data.productImage,
            "reviewRating": data.reviewRating,
            "reviewCount": data.reviewCount,
            "inStock":data.inStock };
            repo.addDocument(product).then(data=> {
            }).catch(function(err) {
              console.log(err);
            });
      }

  });
  pageNumber++;
   }while(pageNumber <= 8);
}

//exposes the addData object
module.exports = Object.assign({}, {addData})
