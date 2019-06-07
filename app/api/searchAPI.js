'use strict'
// app contains reference to the express module
//repo contains reference to repository.js file
module.exports = (app, options) => {
  const {repo} = options
// API for searching the products with different parameters
  app.get('/searchProducts',(req,res,next) => {
    var urlParameters = [
      "search","minPrice","maxPrice","minReviewCount","maxReviewCount","minReviewRating","maxReviewRating","inStock"
    ];
    var query = '';
    var product = [];

    //checking to see if the request query parameters is empty or not. If it
    //is empty it will return all the products.
    if(Object.keys(req.query).length != 0) {
      //checking if the parameters in the url is valid or not
      if(checkValidParameter(req.query,urlParameters)) {
        query = '{ \"query\": { \"bool\": { \"must\": [';// variable containing the DSL query.
        var parametersQuery = formQuery(req.query);// variable containing the query formed by the parameters of the url
        parametersQuery = parametersQuery.substring(0, parametersQuery.length - 1);// removing the "," from the string
        query += parametersQuery+']}}}';
        //searching the elastic search engine with the query called from repository.js file
        repo.search(query).then(resultSet => {
          if(resultSet.length != 0) {
            resultSet.forEach(function(hit){
              product.push(hit._source);
            });
            res.json(product);
          }
          else {
            res.send({Message:"No matching data found"});
          }
          //res.json(product);
        }).catch(next)
        }
        //if the parameters or value are not valid it will throw an error
        else {
          return res.status(400).send({status:400,error:"Invalid Parameters"});
        }
      }
      //forming query in case the request paramters are not supplied
    else {
      query = '{\"query\": {  \"regexp\": { \"productName\": \".+\" }}}';
      //searching the elastic search engine with the query called from the repository.js file
      repo.search(query).then(resultSet => {
        if(resultSet.length != 0) {
          resultSet.forEach(function(hit){
            product.push(hit._source);
          });
        }
        res.json(product);
      }).catch(next)
    }

    //function to check that all the parameters and values are formed correctly for
    //example the parameters should only be from the urlParameters object and
    //also every parameter should have a value.
    function checkValidParameter(requestQuery,urlParameters) {
      for(var propName in requestQuery) {
        if(!(urlParameters.includes(propName)) || requestQuery[propName] == '') {
          return false;
        }
      }
      return true;
    }

    //function to form the DSL query from the request query string to query the elastic search engine
    function formQuery(requestQuery){
      var parametersQuery = '';// building the DSL query for elatic search from the query paramters
      for (var propName in requestQuery) {
        if (requestQuery.hasOwnProperty(propName)) {
          if(propName =='search') {
            parametersQuery += '{\"term\": {\"productName\": \"'+  req.query[propName] +'\"}},';
          } else if(propName == 'minPrice') {
            parametersQuery += '{\"range\" : {\"price\" : { \"gte\" :\"' + req.query[propName] + '\"}}},';
          } else if(propName == 'maxPrice') {
            parametersQuery += '{\"range\" : {\"price\" : { \"lte\" :\"' + req.query[propName] + '\"}}},';
          } else if(propName == 'minReviewRating') {
            parametersQuery += '{\"range\" : {\"reviewRating\" : { \"gte\" :\"' + req.query[propName] + '\"}}},';
          } else if(propName == 'maxReviewRating') {
            parametersQuery += '{\"range\" : {\"reviewRating\" : { \"lte\" :\"' + req.query[propName] + '\"}}},';
          } else if(propName == 'minReviewCount') {
            parametersQuery += '{\"range\" : {\"reviewCount\" : { \"gte\" :\"' + req.query[propName] + '\"}}},';
          } else if(propName == 'maxReviewCount') {
            parametersQuery += '{\"range\" : {\"reviewRating\" : { \"lte\" :\"' + req.query[propName] + '\"}}},';
          } else if(propName == 'inStock') {
            parametersQuery += '{\"term\": {\"'+ propName + '\":\"' + req.query[propName] +'\"}},';
          }
        }
      }
      return parametersQuery;
    }
  });

}
