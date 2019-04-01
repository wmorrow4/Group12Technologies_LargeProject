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

// Probably will need updating.
interface CreateSchedulePayload {
	schedule: swaggerTools.SwaggerRequestParameter<ApiSchedulerInfo & ApiObjectID>
	[paramName: string]: swaggerTools.SwaggerRequestParameter<ApiSchedulerInfo & ApiObjectID> | undefined;
}

module.exports.createSchedule = function (req: api.Request & swaggerTools.Swagger20Request<CreateSchedulePayload>, res: express.Response) {
	
	console.log(util.inspect(req.swagger.params, false, Infinity, true))
	res.setHeader('Content-Type', 'application/json')
	
	if(req.swagger.params.schedule.value.name && req.swagger.params.schedule.value.open
	   && req.swagger.params.schedule.value.close && req.swagger.params.schedule.value.length
	   && req.swagger.params.schedule.value.capacity && req.session) {
		
		var myobj = req.swagger.params.schedule.value;
		
		myobj.belongsTo = new ObjectID(req.session.userid);
		
		db.schedules.insertOne(myobj, function (err: MongoError, result: InsertOneWriteOpResult) {
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

    }
    else {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "All fields must be filled" }, null, 2))
        res.end()
    }
};
