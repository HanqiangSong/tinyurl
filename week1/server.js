var express = require("express");
var app  = express();

var restRouter = require ("./routers/rest");
var redirectRouter = require ("./routers/redirect");

app.use("/api/v1", restRouter);


app.use("/:shortUrl", redirectRouter);
app.listen(3000);
