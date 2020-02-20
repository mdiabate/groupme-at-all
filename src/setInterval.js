var http = require("http");
setInterval(function() {
    //http.get("https://sgp19.herokuapp.com/");
    //http.get("https://lasgidi.herokuapp.com/");
    http.get("http://afronationpr.herokuapp.com/");
  	//http.get("http://dgpanama20.herokuapp.com/");
    //http.get("https://akisan.herokuapp.com/");
    //http.get("http://warm-lake-53440.herokuapp.com"); -- COLOMBIA
    //http.get("http://afternoon-ridge-59499.herokuapp.com"); -- CANCUN
    //http.get("http://thawing-beach-87774.herokuapp.com"); -- HAYWIRE
}, 900000); // every 15 minutes (300000)

setInterval(function(){http.get("http://dgpanama20.herokuapp.com/");}, 1200000);
