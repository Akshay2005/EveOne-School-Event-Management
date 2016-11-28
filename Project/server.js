var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('user:user@ds149437.mlab.com:49437/eveone', ['studentlist']);
var bodyParser = require('body-parser');

var logger = require('morgan');
app.use(logger("dev"));

var http = require('http');
var loadfire = require('loadfire');
 
 
var EDITOR_PORTS = [8081, 8082, 8083,8084];
 
var EDITOR_SERVERS = EDITOR_PORTS.map(function (x) {
    return {
        host: 'localhost',
        port: x
    };
});


// Start all our different http servers 
function startEditorServers(ports) {
    ports.forEach(function (port) {
        // Setup HTTP Server 
     /*
        var httpServer = http.createServer(function(req, res) {
            // Output the port number the server is running on 
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(port.toString());
        });

        // Listen on assigned port 
        httpServer.listen(port);

        */

        http.createServer(app).listen(port, function(){
          console.log('Express server listening on port ' + port);
          });
 
        
    });
}


var CONFIG = {
    'resources': [
        {
            // resource is some value identify this resource 
            // by default it should be the hostname to match 
            resource: 'localhost:8080',
 
            // List of backends to hit 
            backends: EDITOR_SERVERS,
 
            // Load balancing pattern 
            // As of now a few are builtin 
            // random, roundrobin, sticky 
            pattern: 'roundrobin'
        }
    ],
 
    // Server to start loadfire on 
    port: 8080
};


function main() {
    // Start our http servers 
    startEditorServers(EDITOR_PORTS);
 
    // Setup our load balancer with the above config 
    var loadServer = loadfire.createServer(CONFIG);
 
    // Now start our load balancer 
    loadServer.run();
 
    // Check out localhost:8080 
    // Refresh a few times and you'll see different port numbers appear 
    // depending on which http server the requests are proxied to 
    // since we are using the roundrobin pattern it will cycle through them 
}



var stormpath = require('express-stormpath');


app.use(stormpath.init(app,{
  
    client: {
        apiKey: {
            id: '3A6ERPYU38GCYC8BL0KT6RZ6C',
            secret:'5rLj+wlNcTrsdahJMMOZ7LHrkzQsEWbq7oplTHFS8u0'
        }
    },
     application:{

    href:'https://api.stormpath.com/v1/applications/6t5AvCQz6ffrIcm9cZk8ds'
 }


}));



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.get('/test',stormpath.apiAuthenticationRequired, function(req,res){
  res.json({ Autheticated: true});
});

app.get('/studentlist',stormpath.apiAuthenticationRequired, function (req, res) {
  console.log('I received a GET request');

  db.studentlist.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/studentlist',stormpath.apiAuthenticationRequired, function (req, res) {
  console.log(req.body);
  db.studentlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/studentlist/:id',stormpath.apiAuthenticationRequired, function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/studentlist/:id',stormpath.apiAuthenticationRequired, function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/studentlist/:id',stormpath.apiAuthenticationRequired, function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.studentlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, parentemailid: req.body.parentemailid, parentno: req.body.parentno, parentname: req.body.parentname, sid: req.body.sid }},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.on('stormpath.ready', function() {
 // app.listen(3000);
  //console.log("Server running on port 3000");
  main();
});

