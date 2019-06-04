'use strict'

module.exports = (app, options) => {
  const {repo} = options
// API for search the products with different parameters
  app.get('/searchProducts',(req,res,next) => {
    var urlParameters = [
      "search","minPrice","maxPrice","minReviewCount","maxReviewCount","minReviewRating","maxReviewRating","inStock"
    ];
    var query = '';
    var product = [];
    if(Object.keys(req.query).length != 0) {
      if(checkValidParameter(req.query,urlParameters)) {
        query = '{ \"query\": { \"bool\": { \"must\": [';
        var parametersQuery = formQuery(req.query);
        parametersQuery = parametersQuery.substring(0, parametersQuery.length - 1);
        query += parametersQuery+']}}}';
        repo.search(query).then(resultSet => {
          if(resultSet.length != 0) {
            resultSet.forEach(function(hit){
              product.push(hit._source);
            });
          }
          res.json(product);
        }).catch(next)
        }
        else {
          return res.status(400).send({status:400,error:"Invalid Parameters"});
        }
      }
    else {
      query = '{\"query\": {  \"regexp\": { \"productName\": \".+\" }}}';
      repo.search(query).then(resultSet => {
        if(resultSet.length != 0) {
          resultSet.forEach(function(hit){
            product.push(hit._source);
          });
        }
        res.json(product);
      }).catch(next)
    }
    //to check that all the parameters and values are formed correctly
    function checkValidParameter(requestQuery,urlParameters) {
      for(var propName in requestQuery) {
        if(!(urlParameters.includes(propName)) || requestQuery[propName] == '') {
          return false;
        }
      }
      return true;
    }

    //function to form the DSL query from the request query string
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
