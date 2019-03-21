'use strict';

import util = require('util')
import express = require('express')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import ApiContact = db.Contact
import ApiObjectID = db.ObjectID
import ApiSearch = db.Search
import {
    MongoError,
    DeleteWriteOpResultObject,
    ObjectID as MongoObjectID,
    InsertOneWriteOpResult,
    ObjectID
} from 'mongodb';

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

interface ListContactsPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSearch>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSearch> | undefined;
}

interface UpdateContactPayload {
    contact: swaggerTools.SwaggerRequestParameter<ApiContact & ApiObjectID>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiContact & ApiObjectID> | undefined;
}

module.exports.createContact = function (req: api.Request & swaggerTools.Swagger20Request<CreateContactPayload>, res: express.Response) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    if (req.swagger.params.contact.value.firstname && req.session) {

        var myobj = req.swagger.params.contact.value;

        if (req.session) {
            myobj.belongsTo = new ObjectID(req.session.logid);
        }

        db.contacts.insertOne(myobj, function (err: MongoError, result: InsertOneWriteOpResult) {
            if (err) {
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            }
            if (!result) {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: "Create Contact Failed" }, null, 2))
                res.end()
            }
            else {
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

module.exports.listContacts = function (req: api.Request & swaggerTools.Swagger20Request<ListContactsPayload>, res: express.Response) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    function patchContacts(contacts: ApiContact[]) {
        contacts.forEach(contact => {
            if (!contact.pic) {
                contact.pic = '/assets/img/nopic.png'
            }
        })
        return contacts
    }

    //capture search in variable
    const incomingSearch = req.swagger.params.searchInfo.value.search;
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    if (incomingSearch) {

        db.contacts.find({
            $and: [
                {
                    belongsTo: new ObjectID(req.session.logid)
                },
                {
                    $or: [
                        { email: { '$regex': `.*${incomingSearch}.*`, '$options': 'i' } },
                        { firstname: { '$regex': `.*${incomingSearch}.*`, '$options': 'i' } },
                        { lastname: { '$regex': `.*${incomingSearch}.*`, '$options': 'i' } },
                        { phone: { '$regex': `.*${incomingSearch}.*`, '$options': 'i' } }
                    ]
                }
            ]
        }).toArray().then((data) => {
            if (data) {
                res.status(OK)
                res.send(JSON.stringify(patchContacts(data)))
                res.end()
            }
            else {
                res.status(OK)
                res.send(JSON.stringify([], null, 2))
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
        db.contacts.find({
            belongsTo: new ObjectID(req.session.logid)
        }).toArray().then((data) => {
            if (data) {
                res.status(OK)
                res.send(JSON.stringify(patchContacts(data)))
                res.end()
            }
            else {
                res.status(OK)
                res.send(JSON.stringify([], null, 2))
                res.end()
            }
        }).catch((err) => {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        })
    }
};

module.exports.updateContact = function (req: api.Request & swaggerTools.Swagger20Request<UpdateContactPayload>, res: express.Response) {
    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    if (req.session && req.session.logid) {
        db.contacts.find({
            _id: new ObjectID(req.swagger.params.contact.value._id)
        }).toArray().then((data) => {
            if (data.length) {
                if (data[0].belongsTo.equals(new ObjectID(req.session.logid))) {
                    db.contacts.replaceOne({
                        _id: new ObjectID(req.swagger.params.contact.value._id)
                    }, {
                            belongsTo: data[0].belongsTo,
                            firstname: req.swagger.params.contact.value.firstname,
                            lastname: req.swagger.params.contact.value.lastname,
                            email: req.swagger.params.contact.value.email,
                            phone: req.swagger.params.contact.value.phone,
                            pic: req.swagger.params.contact.value.pic,
                        }).then(updateWriteOpResult => {
                            res.status(OK)
                            res.send(JSON.stringify({ message: "Update successful!" }, null, 2))
                            res.end()
                        }).catch(err => {
                            res.status(InternalServerError)
                            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                            res.end()
                        })
                }
                else {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: `This contact does not belong to you ${req.session.email}:${req.session.logid}` }, null, 2))
                    res.end()
                }
            }
            else {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: `There no contact in the database with id: ${req.swagger.params.contact.value._id}` }, null, 2))
                res.end()
            }
        }).catch((err) => {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        })
    }
    else {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "You must be logged in to use this feature." }, null, 2))
        res.end()
    }
};

module.exports.deleteContact = function (req: api.Request & swaggerTools.Swagger20Request<DeleteContactPayload>, res: express.Response) {

    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    var myobj = req.swagger.params.contact.value;

    // Check that we're logged in
    if (!req.session || !req.session.logid) {
        // no session or yes session and no username
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "You are not currently logged in, login in order to add contacts" }, null, 2))
        res.end()
        return;
    }

    // Check that the contact exists and actually belongs to this user.
    db.contacts.findOne({ _id: new MongoObjectID(myobj._id) }, function (err: MongoError, result: ApiContact | null) {
        // TODO: check to see if result is a thing.
        if (err) {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        }
        if (!result) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Contact Doesnt Exist" }, null, 2))
            res.end()
        }
        else {
            // TODO: check to see if Contact belongs to this user.
            if (req.session) {
                if (!result.belongsTo.equals(req.session.logid)) {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: "This contact doesnt belong to the current user" }, null, 2))
                    res.end()
                }
                else {
                    db.contacts.deleteOne({ _id: new MongoObjectID(myobj._id) }, function (err: MongoError, result: DeleteWriteOpResultObject) {
                        if (err) {
                            res.status(InternalServerError)
                            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                            res.end()
                        }
                        if (!result) {
                            res.status(BadRequest)
                            res.send(JSON.stringify({ message: "Delete Function Failed" }, null, 2))
                            res.end()
                        }
                        else {
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