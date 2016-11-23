var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser"); // pass http de body
var jsonParser = bodyParser.json();
var urlService = require("../services/urlService");


router.post("/urls", jsonParser, function (req, res) {
    var longUrl = req.body.longUrl;
    urlService.getShortUrl(longUrl, function (url){
        res.json(url);
    });

});

router.get("/urls/:shortUrl", function(req, res) {
    var shortUrl = req.params.shortUrl;
    urlService.getLongUrl(shortUrl, function (url) {
        if (url) {
            res.json(url);
        }
        else {
            res.status(404).send("Not Exist!");
        }
    });
});

module.exports = router; //return router
