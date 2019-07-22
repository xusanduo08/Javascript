var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var port = 8000;

app.use(express.static(path.join(__dirname)));

app.set('views', __dirname);
app.set('view engine', 'html');

app.get('/', function(req, res){
  res.render('A');
})
app.listen(port);
