var express = require('express'),
app = express(),
server = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

server.listen(3000, function(){
  console.log('listening on port 3000');
});
