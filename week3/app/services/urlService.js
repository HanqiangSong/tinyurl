
var UrlModel = require("../models/urlModel");
var redis = require("redis");
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_PORT_6379_TCP_PORT;

var redisClient = redis.createClient(port,host);


var encode = [];
var genCharArray = function (charA, charZ) {
    var arr = [];
    var i = charA.charCodeAt(0);
    var j = charZ.charCodeAt(0);

    for (; i <= j ; i++) {
        arr.push(String.fromCharCode(i));
    }
    return arr;
}

encode = encode.concat(genCharArray("A","Z"));
encode = encode.concat(genCharArray("a","z"));
encode = encode.concat(genCharArray("0","9"));

var getShortUrl = function (longUrl, callback) {
    if (longUrl.indexOf("http") === -1 ) {
        longUrl = "http://" + longUrl;
    }

    redisClient.get(longUrl, function (err,shortUrl) {
        if (shortUrl) {
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        }
        else {
            UrlModel.findOne({longUrl:longUrl}, function(err, data){
                if (data) {
                    callback(data);
                    redisClient.set(data.shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, data.shortUrl);
                }
                else{
                    generateShortUrl(function (shortUrl){
                        var url = new UrlModel({
                            shortUrl: shortUrl,
                            longUrl: longUrl
                        });
                        url.save();
                        redisClient.set(shortUrl, longUrl);
                        redisClient.set(longUrl, shortUrl);
                        callback(url);
                    });
                }
            });
        }
    });
};

var generateShortUrl = function (callback) {

    UrlModel.count({}, function(err,data) {
        callback(convertTo62(data));
    });

}

var convertTo62 = function (num) {
    var result = "";
    do {
        result = encode[num % 62] + result;
        num = Math.floor(num / 62) ;
    } while (num);
    return result;
}

var getLongUrl = function (shortUrl, callback) {
    redisClient.get(shortUrl, function(err, longUrl) {
        if (longUrl) {
            callback({
                shortUrl:shortUrl,
                longUrl:longUrl
            });
        }
        else{
            UrlModel.findOne({shortUrl: shortUrl}, function (err,data) {
                callback(data);
                if (data) {
                    redisClient.set(data.shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, data.shortUrl);
                }
            })
        }

    });


};


module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};