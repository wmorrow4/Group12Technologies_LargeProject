'use strict';

import util = require('util')
import express = require('express')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import ApiSchedule = db.Schedule
import ApiReservation = db.Reservation
import ApiObjectID = db.ObjectID

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

// Make sure this matches the Swagger.json body parameter for the /schedule API
interface CreateSchedulePayload {
    schedule: swaggerTools.SwaggerRequestParameter<ApiSchedule>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSchedule> | undefined;
}

interface DeleteSchedulePayload {
    schedule: swaggerTools.SwaggerRequestParameter<ApiObjectID>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiObjectID> | undefined;
}

interface RemoveIntervalPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<ApiSchedule & ApiObjectID & ApiReservation>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSchedule & ApiObjectID & ApiReservation> | undefined;
}

module.exports.CreateSchedule = function (req: api.Request & swaggerTools.Swagger20Request<CreateSchedulePayload>, res: express.Response) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

        if (!req.session) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Invalid session" }, null, 2))
            res.end()
        }
        if (!req.session.username) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Login required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.schedule_name == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Schedule name is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.average_appointment_length == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Appointment length is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.max_capacity == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Capacity is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.M == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Monday hours of operation is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.T == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Tuesday hours of operation is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.W == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Wednesday hours of operation is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.Th == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Thursday hours of operation is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.F == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Friday hours of operation is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.S == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Saturday hours of operation is required" }, null, 2))
            res.end()
        }
        if (req.swagger.params.Schedule.value.Su == null) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Sunday hours of operation is required" }, null, 2))
            res.end()
        }

        var scheduleObject = req.swagger.params.Schedule.value;
        scheduleObject.schedulerID = new ObjectID(req.swagger.params.Schedule.value.schedulerID);

        db.Schedule.insertOne(scheduleObject, function (err: MongoError, result: InsertOneWriteOpResult) {
            if (err) {
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            }
            if (!result) {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: "Create Schedule Failed" }, null, 2))
                res.end()
            }
            else {
                res.status(OK)
                res.send(JSON.stringify({ message: "Schedule Inserted Successfully " }, null, 2))
                res.end()
                console.log("1 document inserted");
            }
        });
};

module.exports.deleteSchedule = function (req: api.Request & swaggerTools.Swagger20Request<DeleteSchedulePayload>, res: express.Response) {

    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    var scheduleObject = req.swagger.params.Schedule.value;

    // Check that we're logged in
    if (!req.session || !req.session.username) {
        // no session or yes session and no username
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "You are not currently logged in, login in to delete schedule" }, null, 2))
        res.end()
        return;
    }

    // Check that the schedule exists and actually belongs to this scheduler.
    db.Schedule.findOne({ _id: new MongoObjectID(scheduleObject._id) }, function (err: MongoError, result: ApiSchedule | null) {
        // TODO: check to see if result is a thing.
        if (err) {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        }
        if (!result) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Schedule Doesnt Exist" }, null, 2))
            res.end()
        }
        else {
            // TODO: check to see if Schedule belongs to this user.
                if (!result.schedulerID.equals(req.session.userid)) {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: "This schedule doesnt belong to the current user" }, null, 2))
                    res.end()
                }
                else {
                    db.Schedule.deleteOne({ _id: new MongoObjectID(scheduleObject._id) }, function (err: MongoError, result: DeleteWriteOpResultObject) {
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
                            res.send(JSON.stringify({ message: "Schedule Deleted Successfully " }, null, 2))
                            res.end()
                            console.log("1 document deleted");
                        }
                    })
                }

        }
    })
}

module.exports.removeInterval = function (req: api.Request & swaggerTools.Swagger20Request<RemoveIntervalPayload>, res: express.Response) {

    // print out the params 
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    res.setHeader('Content-Type', 'application/json')

    var scheduleObject = req.swagger.params.Schedule.value;

    // Check that we're logged in
    if (!req.session || !req.session.username) {
        // no session or yes session and no username
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "You are not currently logged in, login in to remove interval" }, null, 2))
        res.end()
        return;
    }

    // Check that the schedule exists and actually belongs to this scheduler.
    db.Schedule.findOne({ _id: new MongoObjectID(scheduleObject._id) }, function (err: MongoError, result: ApiSchedule | null) {
        // TODO: check to see if result is a thing.
        if (err) {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        }
        if (!result) {
            res.status(BadRequest)
            res.send(JSON.stringify({ message: "Schedule Doesnt Exist" }, null, 2))
            res.end()
        }
        else {
            // TODO: check to see if Schedule belongs to this user.
                if (!result.schedulerID.equals(req.session.userid)) {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: "This schedule doesnt belong to the current user" }, null, 2))
                    res.end()
                }
                else {
                    if (req.swagger.params.Reservation.value.Date == null){
                        res.status(BadRequest)
                        res.send(JSON.stringify({message: "Date is required" }, null, 2))
                        res.end()
                    }
                    if (req.swagger.params.Reservation.value.Time == null){
                        res.status(BadRequest)
                        res.send(JSON.stringify({message: "Black out time is required" }, null, 2))
                        res.end()
                    }
                    var reservationsObject = req.swagger.params.Reservation.value;
                    reservationsObject.ScheduleID = scheduleObject.ScheduleID;
                    reservationsObject.UserID = scheduleObject.schedulerID;
                    db.Reservation.insertOne(reservationsObject, function (err: MongoError, result: InsertOneWriteOpResult) {
                        if (err) {
                            res.status(InternalServerError)
                            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                            res.end()
                        }
                        if (!result) {
                            res.status(BadRequest)
                            res.send(JSON.stringify({ message: "Remove Interval Function Failed" }, null, 2))
                            res.end()
                        }
                        else {
                            res.status(OK)
                            res.send(JSON.stringify({ message: "Removed Interval Successfully " }, null, 2))
                            res.end()
                            console.log("1 document deleted");
                        }
                    })
                }

        }
    })
}