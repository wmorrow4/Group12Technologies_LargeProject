'use strict';

import util = require('util')
import express = require('express')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import ApiUserInfo = db.UserInfo
import ApiSchedulerInfo = db.SchedulersInfo
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

// may need to change parameter name: "user info" to user in swagger
interface UserEditPayload {
    user: swaggerTools.SwaggerRequestParameter<ApiUserInfo & ApiObjectID>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiUserInfo & ApiObjectID> | undefined;
}
// may need to change parameter name: "scheduler info" to scheduler in swagger
interface SchedulerEditPayload {
    scheduler: swaggerTools.SwaggerRequestParameter<ApiSchedulerInfo & ApiObjectID>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSchedulerInfo & ApiObjectID> | undefined;
}

interface ListSchedulesPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSearch>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSearch> | undefined;
}

interface ListAppointmentsPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSearch>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSearch> | undefined;
}

module.exports.ClaimAppointment = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')
    res.end()
} 

module.exports.ListSchedules = function (req: api.Request & swaggerTools.Swagger20Request<ListSchedulesPayload>, res: express.Response) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }
    
    //capture search in variable
    const incomingSearch = req.swagger.params.searchInfo.value.search;
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    if (incomingSearch) {

        db.schedules.find({
            $and: [
                {
                    belongsTo: new ObjectID(req.session.logid)
                },
                {
                    $or: [
                        { scheduleName: { '$regex': `.*${incomingSearch}.*`, '$options': 'i' } },
                    ]
                }
            ]
        
        }).toArray().then((data) => {
            
            if (data) {
                res.status(OK)
                res.send(JSON.stringify(data))
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
        db.schedules.find({
            belongsTo: new ObjectID(req.session.logid)
        }).toArray().then((data) => {

            if (data) {
                res.status(OK)
                res.send(JSON.stringify(data))
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
}

module.exports.SchedulerEditInfo = function (req: api.Request & swaggerTools.Swagger20Request<SchedulerEditPayload>, res: express.Response) {
    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    if (req.session && req.session.logid) {
        db.schedulers.find({
            _id: new ObjectID(req.swagger.params.scheduler.value._id)
        }).toArray().then((data) => {
            if (data.length) {
                if (data[0].belongsTo.equals(new ObjectID(req.session.logid))) {
                    db.schedulers.replaceOne({
                        _id: new ObjectID(req.swagger.params.scheduler.value._id)
                    }, {
                            belongsTo: data[0].belongsTo,
                            group: req.swagger.params.scheduler.value.group,
                            email: req.swagger.params.scheduler.value.email,
                            password: req.swagger.params.scheduler.value.password,
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
                    res.send(JSON.stringify({ message: `This scheduler already exists ${req.session.logid}` }, null, 2))
                    res.end()
                }
            }
            else {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: `This scheduler does not exist: ${req.swagger.params.scheduler.value._id}` }, null, 2))
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
}

module.exports.UserEditInfo = function (req: api.Request & swaggerTools.Swagger20Request<UserEditPayload>, res: express.Response) {
    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    if (req.session && req.session.logid) {
        db.users.find({
            _id: new ObjectID(req.swagger.params.user.value._id)
        }).toArray().then((data) => {
            if (data.length) {
                if (data[0].belongsTo.equals(new ObjectID(req.session.logid))) {
                    db.users.replaceOne({
                        _id: new ObjectID(req.swagger.params.user.value._id)
                    }, {
                            belongsTo: data[0].belongsTo,
                            firstname: req.swagger.params.user.value.firstname,
                            lastname: req.swagger.params.user.value.lastname,
                            email: req.swagger.params.user.value.email,
                            password: req.swagger.params.user.value.password,
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
                    res.send(JSON.stringify({ message: `This user already exists ${req.session.logid}` }, null, 2))
                    res.end()
                }
            }
            else {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: `This user does not exist: ${req.swagger.params.user.value._id}` }, null, 2))
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
}

module.exports.ListAppointments = function (req: api.Request & swaggerTools.Swagger20Request<ListAppointmentsPayload>, res: express.Response) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    //capture search in variable
    const incomingSearch = req.swagger.params.searchInfo.value.search;
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    if (incomingSearch) {

        db.appointments.find({
            $and: [
                {
                    belongsTo: new ObjectID(req.session.logid)
                },
                {
                    $or: [
                        // possibly search with date/time objects?
                        //{ scheduleName: { '$regex': `.*${incomingSearch}.*`, '$options': 'i' } },
                    ]
                }
            ]
        
        }).toArray().then((data) => {
            
            if (data) {
                res.status(OK)
                res.send(JSON.stringify(data))
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
        db.appointments.find({
            belongsTo: new ObjectID(req.session.logid)
        }).toArray().then((data) => {
     
            if (data) {
                res.status(OK)
                res.send(JSON.stringify(data))
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
}
