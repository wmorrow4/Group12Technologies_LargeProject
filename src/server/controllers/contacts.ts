'use strict';

import util = require('util')
import session = require('express-session')
import swaggerTools = require('swagger-tools')
import db = require('../db')

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, true)


module.exports.createContact = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')
    
        
    if(req.swagger.params.userinfo.value.FirstName) {

        var myobj = req.swagger.params.userinfo.value;
        myobj.UserID = req.session.username;

        db.contacts.insertOne( req.swagger.params.userinfo.value , function(err:any, res:any) {
            if (err) throw err;
            console.log("1 document inserted");                       
      });   
        res.status(OK)
        res.send(JSON.stringify({ message: "It worked!" }, null, 2))
        res.end()     
    }
    else {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "At least a first name is required" }, null, 2))
        res.end()
    }
    
    
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
    res.setHeader('Content-Type', 'application/json')

    var myobj = req.swagger.params.userinfo.value;
    myobj.UserID = req.session.username;

    var temp = true;
    db.contacts.findOne(req.swagger.params.userinfo.value, function(err:any,result) {
        if (err){}            
        if(!result){
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Contact Doesnt Exist" }, null, 2))
            res.end()
        }
        else{
            db.contacts.deleteOne( myobj , function(err:any, res:any) {
                if (err) throw err;
                console.log("1 document deleted");                       
            });   
            res.status(OK)
            res.send(JSON.stringify({ message: "It worked!" }, null, 2))
            res.end()
        }
            
    });
    

   
    
};


