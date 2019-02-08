'use strict';

import util = require('util')
import express = require('express')
import session = require('express-session')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import ApiContact = db.Contact
import ApiObjectID = db.ObjectID
import {
    MongoError,
    DeleteWriteOpResultObject,
    ObjectID as MongoObjectID, 
    InsertOneWriteOpResult} from 'mongodb';

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, true)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface CreateContactPayload {
    contact: swaggerTools.SwaggerRequestParameter<ApiContact>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiContact> | undefined;
}

interface DeleteContactPayload {
    contact: swaggerTools.SwaggerRequestParameter<ApiObjectID>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiObjectID> | undefined;
}


module.exports.createContact = function(req:express.Request & swaggerTools.Swagger20Request<CreateContactPayload>, res:express.Response) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')
    
        
    if(req.swagger.params.contact.value.firstname && req.session) {

        var myobj = req.swagger.params.contact.value;
        
        if (req.session) {
            myobj.belongsTo = req.session.userid;
        }

        db.contacts.insertOne(myobj, function(err:MongoError, result:InsertOneWriteOpResult) {
            if (err){
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            }
            if(!result){
                res.status(BadRequest)
                res.send(JSON.stringify({ message: "Create Contact Failed" }, null, 2))
                res.end()
            }
            else{
                res.status(OK)
                res.send(JSON.stringify({ message: "Contact Inserted Successfully " }, null, 2))
                res.end()
                console.log("1 document inserted"); 
            }                     
      });  
            
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
    var data;
    var nullArray =[];
    console.log(incomingSearch)

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
	if(incomingSearch) {

        //yes I know this looks disgusting
            db.contacts.find({$and: [{belongsTo: {$eq: req.session.userID}}, 
            {$or: [{email: {$eq: incomingSearch}}, {firstname: {$eq: incomingSearch}}, 
            {lastname: {$eq: incomingSearch}}, {phone: {$eq: incomingSearch}}]}]}).toArray().then((data) => {
                if (data != undefined) {
                    res.status(OK)
                    res.send(JSON.stringify(data));
                    res.end()
                }
                else {
                    res.status(OK)
                    res.send(JSON.stringify(nullArray))
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
            db.contacts.find({$eq: req.session.username}).toArray().then((data) => {
                if (data) {
                    res.status(OK)
                    res.send(JSON.stringify(data));
                    res.end()
                }
                else {
                    res.status(OK)
                    res.send(JSON.stringify(nullArray))
                    res.end()
                }
            }).catch((err) => {
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            })
        }
    

    //package array and return
    res.status(OK)
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

module.exports.deleteContact = function(req:express.Request & swaggerTools.Swagger20Request<DeleteContactPayload>, res:express.Response) {
    
    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    var myobj = req.swagger.params.contact.value;
        
    // Check that we're logged in
    if (!req.session || !req.session.username) {
        // no session or yes session and no username
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "You are not currently logged in, login in order to add contacts" }, null, 2))
        res.end()
    }

    // Check that the contact exists and actually belongs to this user.
    db.contacts.findOne( {_id: new MongoObjectID(myobj._id)} , function(err:MongoError, result:ApiContact | null)
     {
        // TODO: check to see if result is a thing.
        if(err)
        {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        }
        if(!result){
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Contact Doesnt Exist" }, null, 2))
            res.end()
        }
        else{
        // TODO: check to see if Contact belongs to this user.
        if (req.session) {
            if(result.belongsTo != req.session.userid)
            {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: "This contact doesnt belong to the current user" }, null, 2))
                res.end()
            }
            else
            {
                db.contacts.deleteOne( {_id: new MongoObjectID(myobj._id)} , function(err:MongoError, result:DeleteWriteOpResultObject) {
                    if (err){
                        res.status(InternalServerError)
                        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                        res.end()
                    }
                    if(!result){
                        res.status(BadRequest)
                        res.send(JSON.stringify({ message: "Delete Function Failed" }, null, 2))
                        res.end()
                    }
                    else{
                        res.status(OK)
                        res.send(JSON.stringify({ message: "Contact Deleted Successfully " }, null, 2))
                        res.end()
                        console.log("1 document deleted"); 
                    }                                      
                })
            }
        }

    }
    })
}


