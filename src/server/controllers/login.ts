'use strict';

module.exports.signup = function getWeather (req:any, res:any, next:any) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: "Yay! it worked"}, null, 2));
};