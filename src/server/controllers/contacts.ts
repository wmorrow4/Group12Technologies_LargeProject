'use strict';

import util = require('util')

module.exports.createContact = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "It worked!"}, null, 2))
    res.end()
};

module.exports.listContacts = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "It worked!"}, null, 2))
    res.end()
};

module.exports.updateContact = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "It worked!"}, null, 2))
    res.end()
};

module.exports.deleteContact = function(req:any, res:any, next:any) {

    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send(JSON.stringify({message: "It worked!"}, null, 2))
    res.end()
};
