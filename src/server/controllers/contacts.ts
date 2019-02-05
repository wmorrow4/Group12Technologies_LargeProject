'use strict';

import util = require('util')
import db = require('../db')

var url = "mongodb://localhost:27017/";

module.exports.createContact = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    var MongoClient = require('mongodb').MongoClient;    

    MongoClient.connect(url, function(err:any, db:any) {
    if (err) throw err;
    var dbo = db.db("mean");    
    dbo.collection("contacts").insert( req.swagger.params.userinfo.value , function(err:any, res:any) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
  });
})
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "Contact Created"}, null, 2))
    res.end()
};

module.exports.listContacts = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "It worked!"}, null, 2))
    res.end()
};

module.exports.updateContact = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "It worked!"}, null, 2))
    res.end()
};

module.exports.deleteContact = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    var MongoClient = require('mongodb').MongoClient;    

    MongoClient.connect(url, function(err:any, db:any) {
    if (err) throw err;
    var dbo = db.db("mean");    
    dbo.collection("contacts").deleteOne( req.swagger.params.userinfo.value , function(err:any, res:any) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
  });
})

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "Contact Deleted"}, null, 2))
    res.end()
};


