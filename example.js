var http = require("http") ;
var fs = require("fs");

//var server = http.createServer();
// server.listen(3000);

http.createServer(function (req, res) {
    if (req.url === "/") {
        res.writeHead(200, {"Content-Type": "application/json"});
        var obj = {
            name: "Song",
            age: 23
        };
        res.end(JSON.stringify(obj));
    }
        if (req.url === "/api") {
            res.writeHead(200, {"Content-Type": "application"});
            var html = fs.readFileSync(__dirname + "/index.html");
            res.end(html);
        }

}).listen(3000);