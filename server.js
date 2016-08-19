
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var fs           = require('fs');

var filePath = __dirname + "/public" + "/page.txt";

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



