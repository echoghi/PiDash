/** 
 * PiDash Server
 * v2.0.4
 * 5/9/17
 */
var express    = require('express'),
	bodyParser = require('body-parser'),
	chalk      = require('chalk'),
	app 	   = express(), 
	server 	   = require('http').createServer(app); 

require('es6-promise').polyfill();
require('isomorphic-fetch');
var port = 3000;

// Configure app to use bodyParser to parse json data
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
// API Config
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/build'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/', function(req, res) {
    res.json({ message: 'Welcome to the PiDash API' });   
});

var darkSkyKey = 'c760978036a761dc66bf1a05e6958a09'; 
var url_prefix = 'https://api.darksky.net/forecast/' + darkSkyKey + '/';

app.get('/api/darksky', function(req, res) {
    try {
        // Retrieves location coordinates from the PiDash weather query
        var coordinates = req.query.latitude + ',' + req.query.longitude;
        var url = url_prefix + coordinates;
        console.log(chalk.green('Fetching '+ url + "..."));

        fetch(url)
        .then(function(response) {
            if (response.status != 200) {
                res.status(response.status).json({'message': 'Dark Sky server error:' + response.status});
            }
            return response.json();
        })
        .then(function(payload) {
            res.status(200).json(payload);
        });
    } catch(err) {
        console.log(chalk.red("Error occured requesting the Dark Sky API:", err));
        res.status(500).json({'message': 'Error occured requesting the Dark Sky API', 'details' : err});
    }
});
var url_prefix2 = "https://api.coinmarketcap.com/v1/ticker/";
app.get('/api/crypto', function(req, res) {
    try {
        // Retrieves location coordinates (latitude and longitude) from client request query
        var coin = req.query.coin;
        var url  = url_prefix2 + coin;

        console.log(chalk.green('Fetching '+ url + "..."));

        fetch(url)
        .then(function(response) {
            if (response.status != 200) {
                res.status(response.status).json({'message': 'Coin Market Cap server error:' + response.status});
            }
            return response.json();
        })
        .then(function(payload) {
            res.status(200).json(payload);
        });
    } catch(err) {
        console.log(chalk.red("Error occured requesting the CoinMarketCap API:", err));
        res.status(500).json({'message': 'Error occured requesting the CoinMarketCap API', 'details' : err});
    }
});

var GPS = "37.4419 -122.143";
var url_prefix3 = "https://maps.googleapis.com/maps/api/directions/json?origin=" + GPS + "&destination=21269+Stevens+Creek+Blvd,+Cupertino,+CA+95014";
var mapsKey = "AIzaSyD2wLZNp2sbuJNJcACtsvNsTIDfh_TDCFA";
app.get('/api/commute', function(req, res) {
    try {
        // Retrieves location coordinates (latitude and longitude) from client request query
        var coin = req.query.coin;
        var url  = url_prefix3;

        console.log(chalk.green('Fetching '+ url + "..."));

        fetch(url)
        .then(function(response) {
            if (response.status != 200) {
                res.status(response.status).json({'message': 'Google Maps server error:' + response.status});
            }
            return response.json();
        })
        .then(function(payload) {
            res.status(200).json(payload);
        });
    } catch(err) {
        console.log(chalk.red("Error occured requesting the Google Maps API:", err));
        res.status(500).json({'message': 'Error occured requesting the Google Maps API', 'details' : err});
    }
});

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start the server
server.listen(port, function() {
    console.log(chalk.green('listening on port 3000'));
});