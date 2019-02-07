'use strict';

import util = require('util')
import session = require('express-session')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import Contact = db.Contact

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, true)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface CreateContactPayload {
    contact: swaggerTools.SwaggerRequestParameter<Contact>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<Contact> | undefined;
}

module.exports.createContact = function(req:Express.Request & swaggerTools.Swagger20Request<CreateContactPayload>, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')
    
        
    if(req.swagger.params.contact.value.firstname) {

        var myobj = req.swagger.params.contact.value;
        if (req.session) {
            myobj.belongsTo = req.session.username;
        }

        db.contacts.insertOne( req.swagger.params.contact.value , function(err:any, res:any) {
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

    //capture search in variable
	var incomingSearch = req.swagger.params.search;
    var contactsArray;
    console.log(incomingSearch)

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
	if(incomingSearch) {

        //yes I know this looks disgusting
            contactsArray = db.contacts.find({$and: [{belongsTo: {$eq: req.session.userID}}, 
            {$or: [{email: {$eq: incomingSearch}}, {firstname: {$eq: incomingSearch}}, 
            {lastname: {$eq: incomingSearch}}, {phone: {$eq: incomingSearch}}]}]}).toArray().then((data) => {
                if (data) {
                    res.status(OK)
                    res.send(JSON.stringify(data));
                    res.end()
                }
                else {
                    res.status(OK)
                    res.send(JSON.stringify({ message: "no contacts" }, null, 2))
                    res.end()
                }
            }).catch((err) => {
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            })
            }
  
    
    //otherwise return all documents belonging to that user
	else {
            contactsArray = db.contacts.find({$eq: req.session.username}).toArray().then((data) => {
                if (data) {
                    res.status(OK)
                    res.send(JSON.stringify(data));
                    res.end()
                }
                else {
                    res.status(OK)
                    res.send(JSON.stringify({ message: "no contacts" }, null, 2))
                    res.end()
                }
            }).catch((err) => {
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            })
        }
    
    console.log(contactsArray);

    //package array and return
    res.status(OK)
    res.send(JSON.stringify(contactsArray));
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


