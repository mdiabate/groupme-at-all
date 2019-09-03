var http = require("http");
setInterval(function() {
    //http.get("https://sgp19.herokuapp.com/");
    http.get("https://lasgidi.herokuapp.com/");
    //http.get("https://africangreeks.herokuapp.com/");
    //http.get("https://africanfamgreek.herokuapp.com/");
    //http.get("https://cancun-dg.herokuapp.com/");
    http.get("https://akisan.herokuapp.com/");
    http.get("https://colombia-confirmed.herokuapp.com/"); 
    //http.get("http://warm-lake-53440.herokuapp.com"); -- COLOMBIA
    //http.get("http://afternoon-ridge-59499.herokuapp.com"); -- CANCUN
    //http.get("http://thawing-beach-87774.herokuapp.com"); -- HAYWIRE
}, 600000); // every 15 minutes (300000)
