// Startup Express App
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path

var app = express();

app.use(morgan('dev'));
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

var routes = require('./routes')(app); 
app.listen({
  port: process.env.PORT || 3000
}, function(){
	console.log('App server listening on port 3000');
});
 
// handle HTTP GET request to the "/" URL
app.get('/', function(req, res) {

	res.render('index.ejs');  
 
})

//handle 404 errors for all the unhandled requests
app.get('/*', function(req, res) {
    res.status(404).write("404")
    res.end();
 
})
