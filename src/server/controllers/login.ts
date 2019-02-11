'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import UserInfo = db.UserInfo

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, true)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface SignupPayload {
    userinfo: swaggerTools.SwaggerRequestParameter<UserInfo>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<UserInfo> | undefined;
}

module.exports.signup = function (req: api.Request & swaggerTools.Swagger20Request<SignupPayload>, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

    // These should always be filled out because of the swagger validation, but we should still
    // probably check them.
    if (req.swagger.params.userinfo.value.username && req.swagger.params.userinfo.value.password) {
        db.users.findOne({ 'username': req.swagger.params.userinfo.value.username }).then((user) => {
            if (user) {
                res.status(BadRequest)
                res.send(JSON.stringify({ message: `Username ${req.swagger.params.userinfo.value.username} is already in use.` }, null, 2))
                res.end()
            }
            else {
                var bcrypt = require('bcryptjs');
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.swagger.params.userinfo.value.password, salt);

                req.swagger.params.userinfo.value.password = hash;
                
                db.users.insertOne(req.swagger.params.userinfo.value).then((writeOpResult) => {
                    if (req.session) {
                        req.session.username = req.swagger.params.userinfo.value.username
                        req.session.userid = writeOpResult.insertedId.toHexString()
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
        res.send(JSON.stringify({ message: "Username and password are required" }, null, 2))
        res.end()
    }
}

module.exports.userLogin = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

    // These should always be filled out because of the swagger validation, but we should still
    // probably check them.
    if (req.swagger.params.userinfo.value.username && req.swagger.params.userinfo.value.password) {
        db.users.findOne({ 'username': req.swagger.params.userinfo.value.username }).then((user) => {
            var bcrypt = require('bcryptjs');

            if (user != null)
            {
                var hash = user.password;
                var success = bcrypt.compare(req.swagger.params.userinfo.value.password, hash);

                if (success) {
                    req.swagger.params.userinfo.value.password = hash;
                }
            }

            db.users.findOne(req.swagger.params.userinfo.value).then((user) => {
                if (user) {
                    if (req.session) {
                        req.session.username = req.swagger.params.userinfo.value.username
                        req.session.userid = user._id
                    }
    
                    res.status(OK)
                    res.send(JSON.stringify({ message: "It worked!" }, null, 2))
                    res.end()
                }
                else {
                    res.status(BadRequest)
                    res.send(JSON.stringify({ message: "Username and password did not match any known user, your hash is: "}, null, 2))
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
        res.send(JSON.stringify({ message: "Username and password are required" }, null, 2))
        res.end()
    }
}

module.exports.userLogout = function (req: any, res: any, next: any) {
    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    let username, userid
    if (req.session) {
        username = req.session.username
        userid = req.session.userid
        delete req.session.userid
        delete req.session.username
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(OK)
    res.send(JSON.stringify({ message: `Logged out user: ${username} ${userid}` }, null, 2))
    res.end()
}
