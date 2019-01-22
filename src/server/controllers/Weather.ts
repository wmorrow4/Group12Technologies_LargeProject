'use strict';

module.exports.getWeather = function getWeather (req:any, res:any, next:any) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({foo: "bar"}, null, 2));
};