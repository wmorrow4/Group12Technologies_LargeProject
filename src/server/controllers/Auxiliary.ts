'use strict';

import util = require('util')
import express = require('express')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import ApiUser = db.User
import ApiScheduler = db.Scheduler
import ApiSchedule = db.Schedule
import ApiReservation = db.Reservation
import ApiObjectID = db.ObjectID
import ApiSearch = db.Search
import {
    MongoError,
    DeleteWriteOpResultObject,
    ObjectID as MongoObjectID,
    InsertOneWriteOpResult,
    ObjectID
} from 'mongodb';
import { RSA_NO_PADDING } from 'constants';

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, true)

interface ClaimAppointmentPayload {
    claimappointment: swaggerTools.SwaggerRequestParameter<ApiReservation & ApiSchedule & ApiUser> 
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiReservation & ApiSchedule & ApiUser> | undefined;
}

interface UserEditInfoPayload {
    user: swaggerTools.SwaggerRequestParameter<ApiUser & ApiObjectID>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiUser & ApiObjectID> | undefined;
}

interface SchedulerEditInfoPayload {
    scheduler: swaggerTools.SwaggerRequestParameter<ApiScheduler & ApiObjectID>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiScheduler & ApiObjectID> | undefined;
}

interface ListmySchedulesPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSearch>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSearch> | undefined;
}

interface ListSchedulesPayload {
    list: swaggerTools.SwaggerRequestParameter<ApiScheduler>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiScheduler> | undefined;
}

interface ListAppointmentsPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSearch>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSearch> | undefined;
}

interface ListSchedulersPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSearch>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSearch> | undefined;
}


module.exports.ClaimAppointment = function (req: api.Request & swaggerTools.Swagger20Request<ClaimAppointmentPayload>, res: express.Response) {
    
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    var claimappointmentObject = req.swagger.params.claimappointment.value;

    if (!req.session) {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "Invalid session" }, null, 2))
        res.end()
    }
    if (!req.session.username) {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "Login required"}, null, 2))
        res.end()
    }
    db.Schedule.findOne({ _id: new MongoObjectID(claimappointmentObject.s_id) }, function (err: MongoError, result: ApiSchedule | null) {
        if (err) {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        }
        if (!result)  {
            res.status(BadRequest)
            res.send(JSON.stringify({ messagge: "Schedule Doesn't exist" }, null, 2))
            res.end()
        }
        else {
            if (claimappointmentObject.Date && claimappointmentObject.Time) {
                db.Reservation.find({
                    $and: [
                        {
                            ScheduleID: new ObjectID(claimappointmentObject.s_id)
                        },
                        {
                            Date: claimappointmentObject.Date
                        },
                        {
                            Time: claimappointmentObject.Time
                        }
                    ]
                }).toArray().then((data) => {
                    if(data) {
                        if ((data.length + 1) >= claimappointmentObject.max_capacity) {
                            res.status(BadRequest)
                            res.send(JSON.stringify({ message: "Appointment capacity is full" }, null, 2))
                            res.end()
                        }
                        else {
                            res.status(OK)
                            res.send(JSON.stringify(data))
                            res.end()
                        }
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
                db.Reservation.insertOne(claimappointmentObject, function (err: MongoError, result: InsertOneWriteOpResult) {
                    if (err) {
                        res.status(InternalServerError)
                        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                        res.end()
                    }
                    if (!result) {
                        res.status(BadRequest)
                        res.send(JSON.stringify({ message: "Claim Appointment Function Failed" }, null, 2))
                        res.end()
                    }
                    else {
                        res.status(OK)
                        res.send(JSON.stringify({ message: "Claimed Appointment Succesfully" }, null, 2))
                        res.end()
                    }
                })
            }
        }
    }) 
};

module.exports.ListmySchedules = function (req: api.Request & swaggerTools.Swagger20Request<ListmySchedulesPayload>, res: express.Response) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }
    
    db.Schedule.find({
        schedulerID: new ObjectID(req.session.userid)
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
};

module.exports.ListSchedules = function (req: api.Request & swaggerTools.Swagger20Request<ListSchedulesPayload>, res: express.Response) {
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }
    
    db.Schedule.find({
        schedulerID: new ObjectID(req.swagger.params.list.value.schedulerID)
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
};

module.exports.SchedulerEditInfo = function (req: api.Request & swaggerTools.Swagger20Request<SchedulerEditInfoPayload>, res: express.Response) {
    
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    if (req.session && req.session.userid) {
        db.Scheduler.find({
            _id: new ObjectID(req.swagger.params.scheduler.value._id)
        }).toArray().then((data) => {
            if (data.length) {
                if (data[0].schedulerID.equals(new ObjectID(req.session.userid))) {
                    db.Scheduler.replaceOne({
                        _id: new ObjectID(req.swagger.params.scheduler.value._id)
                    }, {
                            schedulerID: data[0].schedulerID,
                            name: req.swagger.params.scheduler.value.name,
                            username: req.swagger.params.scheduler.value.username,
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
                    res.send(JSON.stringify({ message: `Could not update info ${req.session.username}:${req.session.userid}` }, null, 2))
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
};

module.exports.UserEditInfo = function (req: api.Request & swaggerTools.Swagger20Request<UserEditInfoPayload>, res: express.Response) {
    
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    if (req.session && req.session.userid) {
        db.User.find({
            _id: new ObjectID(req.swagger.params.user.value._id)
        }).toArray().then((data) => {
            if (data.length) {
                if (data[0]._id.equals(new ObjectID(req.session.userid))) {
                    db.User.replaceOne({
                        _id: new ObjectID(req.swagger.params.user.value._id)
                    }, {
                            _id: data[0]._id,
                            username: req.swagger.params.user.value.username,
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
                    res.send(JSON.stringify({ message: `Could not update info ${req.session.username}:${req.session.userid}` }, null, 2))
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
};

module.exports.ListAppointments = function (req: api.Request & swaggerTools.Swagger20Request<ListAppointmentsPayload>, res: express.Response) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    db.Reservation.find({
            UserID: new ObjectID(req.session.userid)
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
};

module.exports.ListSchedulers = function (req: api.Request & swaggerTools.Swagger20Request<ListSchedulersPayload>, res: express.Response) {
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    if (!req.session) {
        return
    }
    db.Scheduler.find({}).toArray().then((data) => {
 
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
};