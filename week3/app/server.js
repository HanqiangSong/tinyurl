var express = require("express");
var app  = express();

var restRouter = require ("./routers/rest");
var redirectRouter = require ("./routers/redirect");
var indexRouter = require("./routers/index");

var mongoose = require("mongoose");
mongoose.connect("mongodb://Gavinsoar:Messi123@ds049171.mlab.com:49171/tinyurl");

app.use("/public", express.static(__dirname + "/public"));

app.use("/api/v1", restRouter);

app.use("/", indexRouter)
app.use("/:shortUrl", redirectRouter);
app.listen(3000);
