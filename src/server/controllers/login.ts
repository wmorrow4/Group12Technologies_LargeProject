'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import User = db.User

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, true)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface SignupPayload {
    userinfo: swaggerTools.SwaggerRequestParameter<User>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<User> | undefined;
}

interface SchedulerSignupPayload {
    schedulerinfo: swaggerTools.SwaggerRequestParameter<db.Scheduler>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<db.Scheduler> | undefined;
}

module.exports.SchedulerSignup = function (req: api.Request & swaggerTools.Swagger20Request<SchedulerSignupPayload>, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

    // These should always be filled out because of the swagger validation, but we should still
    // probably check them.
    if (req.swagger.params.schedulerinfo.value.group &&req.swagger.params.schedulerinfo.value.email && req.swagger.params.schedulerinfo.value.password) {
        db.Scheduler.findOne({ 'email': req.swagger.params.schedulerinfo.value.email }).then((scheduler) => {
            if (scheduler) {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: `Email ${req.swagger.params.schedulerinfo.value.email} is already in use.` }, null, 2))
                res.end()
            }
            else {
                var bcrypt = require('bcryptjs');
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.swagger.params.schedulerinfo.value.password, salt);

                req.swagger.params.schedulerinfo.value.password = hash;
                
                db.Scheduler.insertOne(req.swagger.params.schedulerinfo.value).then((writeOpResult) => {
                    if (req.session) {
                        req.session.email = req.swagger.params.schedulerinfo.value.email
                        req.session.logid = writeOpResult.insertedId.toHexString()
                        req.session.type = "Scheduler"
                    }

                    res.status(OK)
                    res.send(JSON.stringify({ message: "It worked!" }, null, 2))
                    res.end()
                }).catch((err) => {
                    res.status(InternalServerError)
                    res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                    res.end()
                })
            }
        }).catch((err) => {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        })
    }
    else {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "Name, Email, and password are required" }, null, 2))
        res.end()
    }
}

module.exports.SchedulerLogin = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

    // These should always be filled out because of the swagger validation, but we should still
    // probably check them.
    if (req.swagger.params.schedulerinfo.value.email && req.swagger.params.schedulerinfo.value.password) {
        db.Scheduler.findOne({ 'email': req.swagger.params.schedulerinfo.value.email }).then((scheduler) => {
            var bcrypt = require('bcryptjs');

            if (scheduler != null)
            {
                var hash = scheduler.password;
                var success = bcrypt.compare(req.swagger.params.schedulerinfo.value.password, hash);

                if (success) {
                    req.swagger.params.schedulerinfo.value.password = hash;
                }
            }

            db.Scheduler.findOne(req.swagger.params.schedulerinfo.value).then((scheduler) => {
                if (scheduler) {
                    if (req.session) {
                        req.session.email = req.swagger.params.schedulerinfo.value.email
                        req.session.logid = scheduler.schedulerID
                        req.session.type = "Scheduler"
                    }
    
                    res.status(OK)
                    res.send(JSON.stringify({ message: "It worked!" }, null, 2))
                    res.end()
                }
                else {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: "Email and password did not match any known user, your hash is: "}, null, 2))
                    res.end()
                }
            }).catch((err) => {
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            })
        }).catch((err) => {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        })
    }
    else {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "Email and password are required" }, null, 2))
        res.end()
    }
}

module.exports.UserSignup = function (req: api.Request & swaggerTools.Swagger20Request<SignupPayload>, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

    // These should always be filled out because of the swagger validation, but we should still
    // probably check them.
    if (req.swagger.params.userinfo.value.firstname && req.swagger.params.userinfo.value.lastname && req.swagger.params.userinfo.value.email && req.swagger.params.userinfo.value.password) {
        db.User.findOne({ 'email': req.swagger.params.userinfo.value.email }).then((user) => {
            if (user) {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: `Email ${req.swagger.params.userinfo.value.email} is already in use.` }, null, 2))
                res.end()
            }
            else {
                var bcrypt = require('bcryptjs');
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.swagger.params.userinfo.value.password, salt);

                req.swagger.params.userinfo.value.password = hash;
                
                db.User.insertOne(req.swagger.params.userinfo.value).then((writeOpResult) => {
                    if (req.session) {
                        req.session.email = req.swagger.params.userinfo.value.email
                        req.session.logid = writeOpResult.insertedId.toHexString()
                        req.session.type = "User"
                    }

                    res.status(OK)
                    res.send(JSON.stringify({ message: "It worked!" }, null, 2))
                    res.end()
                }).catch((err) => {
                    res.status(InternalServerError)
                    res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                    res.end()
                })
            }
        }).catch((err) => {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        })
    }
    else {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "Name, email, and password are required" }, null, 2))
        res.end()
    }
}

module.exports.UserLogin = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

    // These should always be filled out because of the swagger validation, but we should still
    // probably check them.
    if (req.swagger.params.userinfo.value.email && req.swagger.params.userinfo.value.password) {
        db.User.findOne({ 'email': req.swagger.params.userinfo.value.email }).then((user) => {
            var bcrypt = require('bcryptjs');

            if (user != null)
            {
                var hash = user.password;
                var success = bcrypt.compare(req.swagger.params.userinfo.value.password, hash);

                if (success) {
                    req.swagger.params.userinfo.value.password = hash;
                }
            }

            db.User.findOne(req.swagger.params.userinfo.value).then((user) => {
                if (user) {
                    if (req.session) {
                        req.session.email = req.swagger.params.userinfo.value.email
                        req.session.userid = user._id
                        req.session.type = "User"
                    }
    
                    res.status(OK)
                    res.send(JSON.stringify({ message: "It worked!" }, null, 2))
                    res.end()
                }
                else {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: "Email and password did not match any known user, your hash is: "}, null, 2))
                    res.end()
                }
            }).catch((err) => {
                res.status(InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                res.end()
            })
        }).catch((err) => {
            res.status(InternalServerError)
            res.send(JSON.stringify({ message: inspect(err) }, null, 2))
            res.end()
        })
    }
    else {
        res.status(BadRequest)
        res.send(JSON.stringify({ message: "Email and password are required" }, null, 2))
        res.end()
    }
}

module.exports.UserLogout = function (req: any, res: any, next: any) {
    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    let email, logid
    if (req.session) {
        email = req.session.email
        logid = req.session.logid
        delete req.session.logid
        delete req.session.email
        delete req.session.type
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(OK)
    res.send(JSON.stringify({ message: `Logged out user: ${email} ${logid}` }, null, 2))
    res.end()
}

module.exports.SchedulerLogout = function (req: any, res: any, next: any) {
    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    let email, logid
    if (req.session) {
        email = req.session.email
        logid = req.session.logid
        delete req.session.email
        delete req.session.logid
        delete req.session.type
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(OK)
    res.send(JSON.stringify({ message: `Logged out scheduler: ${email} ${logid}` }, null, 2))
    res.end()
} 