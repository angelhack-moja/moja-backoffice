
var express = require("express"),
        app = express(),
        bodyParser = require('body-parser'),
        errorHandler = require('errorhandler'),
        passport = require('passport'),
        methodOverride = require('method-override'),
        hostname = process.env.HOSTNAME || 'localhost',
        port = parseInt(process.env.PORT, 10) || 4567,
        publicDir = process.argv[2] || __dirname + '/public';




app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(publicDir));
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));



app.get("/", function (req, res) {
    res.redirect("/index.html");
});

app.post("/api/challenges", function (req, res) {
    
//    console.log(req.params);
//    console.log(req.query);
    console.log(req.body);
    
    var db = require('./lib/db');
    
    db.create(req.body, function(err, resp) {
        
        if(err) {
            res.status(500).send(err);
            return;
        }
        
        res.status(200).send();        
    });
    
  

    
});

//app.get('/wines', wine.findAll);
app.get("/api/challenges", function (req, res) {


//    console.log(req.params);
//    console.log(req.query);
    //console.log(req.body);

    var db = require('./lib/db');

    db.findAll(function(error, response){

        res.status(200).send(response);
    });




});

app.get("/api/game/:id", function (req, res) {

    console.log("params %j", req.params);

    var db = require('./lib/db');

    db.findBy({ 
        type: 'challenge',
        id: req.body.id
    }, function(error, response) {
        
        res.sendFile(publicDir + '/game.html');
    });

});

app.get("/api/challenge/:id", function (req, res) {


//    console.log(req.params);
//    console.log(req.query);
    //console.log(req.body);

    var db = require('./lib/db');

    db.findById(function(error, response){

        res.status(200).send(response);
    });




});




console.log("Simple static server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port, hostname);