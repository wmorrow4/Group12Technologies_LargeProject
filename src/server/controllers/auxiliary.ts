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

module.exports.ClaimAppointment = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')
    res.end()
} 

module.exports.ListSchedules = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')
    res.end()
} 

module.exports.SchedulerEditInfo = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')
    res.end()
} 

module.exports.UserEditInfo = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')
    res.end()
} 

module.exports.ListAppointments = function (req: any, res: any, next: any) {
    // print out the params
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')
    res.end()
} 
