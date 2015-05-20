
var cps = require('cps-api');
var config = require('./config');

var conn;
var connect = function() {
    
    var dbconf = config.get().clusterpoint;
    
    console.log(dbconf);
    
    conn = conn || new cps.Connection(
            dbconf.url,
            dbconf.db, dbconf.username, dbconf.password, 
            dbconf.doc, dbconf.doc_id, 
            {account: dbconf.account}
    );
    
    // Debug
//    conn.debug = true;    
    
    return conn;
};

//var xml = function(obj) {
//    
//    var str = [ '<document>' ];
//    
//    for(var i in obj) {
//        str.push('<'+i+'>'+ obj[i] +'</'+i+'>');
//    }
//    str.push('</document>');
//    
//    return str.join('');
//};


module.exports.create = function(document, then) {
    
    var docs = [ document ];
    
    if(document instanceof Array) {
        docs = document;
    }
    
    console.log("doc --->", document);
    
    connect().sendRequest(new cps.InsertRequest(docs), function (err, resp) {
        if (err) {
            
            console.error(err);
            return then ? then(null, resp) : null;
        } // Handle error
        
        console.log("stored!", resp);
        
        then && then(null, resp);
        
    });

};

module.exports.findAll = function(then) {
    //var id = req.params.id;
    console.log('Retrieving challenges.. ');
    connect().sendRequest(new cps.SearchRequest("{" + cps.Term("challenge", "type") + "}"), function (err, resp) {
        if (err) {
            console.error(err);
            return then ? then(null, resp) : null;
        } // Handle error

        console.log("Results!", resp);

        then && then(null, resp);

    });
};


module.exports.findBy = function(obj, then) {
    //var id = req.params.id;
    console.log('Retrieving challenges.. ');
    
    var args = ['{'];
    for(var i in obj) {
        args.push( cps.Term(obj[i], i) );
    }
    args.push( '}' );
    
    connect().sendRequest(new cps.SearchRequest(args.join('')), function (err, resp) {
        
        if (err) {
            console.error(err);
            return then ? then(null, resp) : null;
        } // Handle error

        console.log("Results!", resp);

        then && then(null, resp);

    });
};


module.exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving challenges.. ');
    connect().sendRequest(new cps.SearchRequest("{" + cps.Term(id , "id") + "}"), function (err, resp) {
        if (err) {
            console.error(err);
            return then ? then(null, resp) : null;
        } // Handle error

        console.log("Results!", resp);

        then && then(null, resp);

    });
};