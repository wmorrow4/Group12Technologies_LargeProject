'use strict';

import util = require('util')
import session = require('express-session')
import swaggerTools = require('swagger-tools')

interface UserInfo {
    username: string,
    password: string
}

// Make sure this matches the Swagger.json body parameter for the /signup API
interface SignupPayload {
    userinfo: swaggerTools.SwaggerRequestParameter<UserInfo>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<UserInfo> | undefined;    
}

module.exports.signup = function(req:Express.Request & swaggerTools.Swagger20Request<SignupPayload>, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    const loginSucceeded = true

    if (loginSucceeded) {
        if (req.session) {
            req.session.username = req.swagger.params.userinfo.value.username
        }
    
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(JSON.stringify({message: "It worked!"}, null, 2))
        res.end()
    }
    else {

    }
};

module.exports.userLogin = function(req:any, res:any, next:any) {
    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))
    const loginSucceeded = true

    if (loginSucceeded) {
        if (req.session) {
            req.session.username = req.swagger.params.userinfo.value.username
        }
    
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(JSON.stringify({message: "It worked!"}, null, 2))
        res.end()
    }
    else {

    }
};

module.exports.userLogout = function(req:any, res:any, next:any) {
    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    if (req.session) {
        delete req.session.username
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "It worked!"}, null, 2))
    res.end()
};