var express = require("express");
var router = express.Router();
var urlService = require("../services/urlService");
var path = require("path");

router.get("*", function (req, res) {
    var shortUrl = req.originalUrl.slice(1); // remove the "/"
    urlService.getLongUrl(shortUrl, function (url) {
        if(url) {
            res.redirect(url.longUrl);
        }
        else {
            res.sendFile("404.html",{root: path.join(__dirname,"../views")});
        }
    });

});
module.exports = router; //return router
