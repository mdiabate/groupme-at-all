var http = require("http");
setInterval(function() {
    http.get("https://colombia-dg.herokuapp.com/");
    http.get("https://cancun-dg.herokuapp.com/");
    //http.get("http://oga-gort1.herokuapp.com"); -- AKISAN
    //http.get("http://warm-lake-53440.herokuapp.com"); -- COLOMBIA
    //http.get("http://afternoon-ridge-59499.herokuapp.com"); -- CANCUN
    //http.get("http://thawing-beach-87774.herokuapp.com"); -- HAYWIRE
}, 900000); // every 15 minutes (300000)
