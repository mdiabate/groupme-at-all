var http = require("http");
setInterval(function() {
    http.get("http://oga-gort1.herokuapp.com");
    http.get("http://warm-lake-53440.herokuapp.com");
    http.get("http://afternoon-ridge-59499.herokuapp.com");
    http.get("https://thawing-beach-87774.herokuapp.com");
}, 300000); // every 5 minutes (300000)
