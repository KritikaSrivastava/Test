
The application has been deployed on AWS EC2 instance. The url can be accessed on the web

Valid Parameters - 
search, minPrice, maxPrice, minReviewRating, maxReviewRating, minReviewCount, maxReviewCount, inStock

Sample URL's -

http://ec2-13-56-115-212.us-west-1.compute.amazonaws.com:3000/searchProducts/
--This url will fetch all the products

http://ec2-13-56-115-212.us-west-1.compute.amazonaws.com:3000/searchProducts/search=tv&minPrice=50

http://ec2-13-56-115-212.us-west-1.compute.amazonaws.com:3000/searchProducts/search=DVD&maxPrice=800&minReviewrating=3

http://ec2-13-56-115-212.us-west-1.compute.amazonaws.com:3000/searchProducts/inStock=true&maxReviewCount=100

http://ec2-13-56-115-212.us-west-1.compute.amazonaws.com:3000/searchProducts/abc=abc
--Invalid Parameter error

http://ec2-13-56-115-212.us-west-1.compute.amazonaws.com:3000/searchProducts/search
--Invalid Parameter error




