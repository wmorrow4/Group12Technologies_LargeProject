'use strict';

import util = require('util')
import express = require('express')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import ApiUserInfo = db.UserInfo
import ApiSchedulerInfo = db.SchedulersInfo
import ApiSchedules = db.Schedules
import ApiReservations = db.Reservations
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
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSchedules>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSchedules> | undefined;
}

interface ListAppointmentsPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiReservations>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiReservations> | undefined;
}

interface ClaimAppointmentPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSchedules & ApiReservations>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSchedules & ApiReservations> | undefined;
}

module.exports.ClaimAppointment = function (req: api.Request & swaggerTools.Swagger20Request<ClaimAppointmentPayload>, res: express.Response) {
    
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session || !req.swagger.params.scheduleInfo) {
        return
    }

    db.schedules.findOne(req.swagger.params.scheduleInfo.value.scheduleID).then((schedule) => {

        if (schedule && req.swagger.params.scheduleInfo){
            db.reservations.find({
                $and: [
                    {
                        scheduleID: req.swagger.params.scheduleInfo.value.scheduleID
                    },
                    {
                        date: req.swagger.params.scheduleInfo.value.date
                    },
                    {
                        time: req.swagger.params.scheduleInfo.value.time
                    }
                ]
            }) .toArray().then((appointments) => {
                if (appointments && req.swagger.params.scheduleInfo) {
                    if (appointments.length < schedule.appointmentCapacity) {
                        for (var i = 0; i < appointments.length; i++)
                        {
                            if(req.swagger.params.scheduleInfo && !appointments[i].userID && req.swagger.params.scheduleinfo.value.userID){
                                appointments[i].userID = req.swagger.params.scheduleinfo.value.userID
                            }
                        }
                    }
                    else {
                        res.status(BadRequest)
                        res.send(JSON.stringify({ message: "This schedule is already at full capacity."}, null, 2))
                        res.end()
                    }

                    res.status(OK)
                    res.send(JSON.stringify({ message: "It worked!" }, null, 2))
                    res.end()
                }
                else {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: "Appointment inputed did not match any known schedule."}, null, 2))
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
            res.send(JSON.stringify({ message: "Schedule inputed did not match any known schedule."}, null, 2))
            res.end()
        }
    }).catch((err) => {
        res.status(InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })
}  

module.exports.ListSchedules = function (req: api.Request & swaggerTools.Swagger20Request<ListSchedulesPayload>, res: express.Response) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }
    
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

module.exports.SchedulerEditInfo = function (req: api.Request & swaggerTools.Swagger20Request<SchedulerEditPayload>, res: express.Response) {
    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    if (req.session && req.session.logid) {
        db.schedulers.find({
            _id: new ObjectID(req.swagger.params.scheduler.value._id)
        }).toArray().then((data) => {
            if (data.length) {
                if (data[0]._id.equals(new ObjectID(req.session.logid))) {
                    db.schedulers.replaceOne({
                        _id: new ObjectID(req.swagger.params.scheduler.value._id)
                    }, {
                            _id: data[0]._id,
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
                if (data[0]._id.equals(new ObjectID(req.session.logid))) {
                    db.users.replaceOne({
                        _id: new ObjectID(req.swagger.params.user.value._id)
                    }, {
                            _id: data[0]._id,
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

    db.reservations.find({
            userID: new ObjectID(req.session.logid)
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
