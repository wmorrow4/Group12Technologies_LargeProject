"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const express = require("express");
const swaggerTools = require("swagger-tools");
const cookieParser = require("cookie-parser");
const db = require("./db");
const session = require('express-session');
// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = require('../assets/swagger.json');
const app = express();
const port = process.env.PORT || 8080;
// swaggerRouter configuration
var options = {
    controllers: `${__dirname}/controllers`,
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};
const secret = 'somerandomstuff';
app.use(cookieParser(secret));
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    name: 'sid',
    secret: secret,
    resave: false,
    saveUninitialized: true,
}));
// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    const apiRequest = req;
    // convert user session into user cookie
    if (apiRequest.session && apiRequest.session.email) {
        res.cookie('email', apiRequest.session.email);
    }
    else {
        res.clearCookie('email');
    }
    next();
});
app.use('/', (req, res, next) => {
    var result = req.url.match(/^\/server.*$/);
    if (result) {
        return res.status(403).end('403 Forbidden');
    }
    next();
});
app.use('/', express.static('dist'));
// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());
    // Validate Swagger requests
    app.use(middleware.swaggerValidator({
        validateResponse: true
    }));
    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));
    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
    // Custom error handler that returns JSON
    app.use(function (err, req, res, next) {
        if (typeof err !== 'object') {
            // If the object is not an Error, create a representation that appears to be
            err = {
                message: String(err) // Coerce to string
            };
        }
        else {
            // Ensure that err.message is enumerable (It is not by default)
            Object.defineProperty(err, 'message', { enumerable: true });
            if (Buffer.isBuffer(err.originalResponse)) {
                err.originalResponse = err.originalResponse.toString();
            }
        }
        res.statusCode = 500;
        res.json(err);
    });
});
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
    db.connectToMongo().then(() => {
        console.log(`Server connected to MongoDB...`);
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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bXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3RlcidcbmltcG9ydCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpXG5pbXBvcnQgc3dhZ2dlclRvb2xzID0gcmVxdWlyZSgnc3dhZ2dlci10b29scycpXG5pbXBvcnQgY29va2llUGFyc2VyID0gcmVxdWlyZSgnY29va2llLXBhcnNlcicpXG5pbXBvcnQgZGIgPSByZXF1aXJlKCcuL2RiJylcbmltcG9ydCBhcGkgPSByZXF1aXJlKCcuL2FwaScpXG5cbmNvbnN0IHNlc3Npb24gPSByZXF1aXJlKCdleHByZXNzLXNlc3Npb24nKVxuXG4vLyBUaGUgU3dhZ2dlciBkb2N1bWVudCAocmVxdWlyZSBpdCwgYnVpbGQgaXQgcHJvZ3JhbW1hdGljYWxseSwgZmV0Y2ggaXQgZnJvbSBhIFVSTCwgLi4uKVxuY29uc3Qgc3dhZ2dlckRvYyA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9zd2FnZ2VyLmpzb24nKVxuXG5jb25zdCBhcHAgPSBleHByZXNzKClcbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDgwODBcblxuLy8gc3dhZ2dlclJvdXRlciBjb25maWd1cmF0aW9uXG52YXIgb3B0aW9ucyA9IHtcbiAgICBjb250cm9sbGVyczogYCR7X19kaXJuYW1lfS9jb250cm9sbGVyc2AsXG4gICAgdXNlU3R1YnM6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gdHJ1ZSA6IGZhbHNlIC8vIENvbmRpdGlvbmFsbHkgdHVybiBvbiBzdHVicyAobW9jayBtb2RlKVxufVxuXG5jb25zdCBzZWNyZXQgPSAnc29tZXJhbmRvbXN0dWZmJ1xuXG5hcHAudXNlKGNvb2tpZVBhcnNlcihzZWNyZXQpKVxuXG4vLyBpbml0aWFsaXplIGV4cHJlc3Mtc2Vzc2lvbiB0byBhbGxvdyB1cyB0cmFjayB0aGUgbG9nZ2VkLWluIHVzZXIgYWNyb3NzIHNlc3Npb25zLlxuYXBwLnVzZShzZXNzaW9uKHtcbiAgICBuYW1lOiAnc2lkJyxcbiAgICBzZWNyZXQ6IHNlY3JldCxcbiAgICByZXNhdmU6IGZhbHNlLFxuICAgIHNhdmVVbmluaXRpYWxpemVkOiB0cnVlLFxufSkpO1xuXG5cbi8vIFRoaXMgbWlkZGxld2FyZSB3aWxsIGNoZWNrIGlmIHVzZXIncyBjb29raWUgaXMgc3RpbGwgc2F2ZWQgaW4gYnJvd3NlciBhbmQgdXNlciBpcyBub3Qgc2V0LCB0aGVuIGF1dG9tYXRpY2FsbHkgbG9nIHRoZSB1c2VyIG91dC5cbi8vIFRoaXMgdXN1YWxseSBoYXBwZW5zIHdoZW4geW91IHN0b3AgeW91ciBleHByZXNzIHNlcnZlciBhZnRlciBsb2dpbiwgeW91ciBjb29raWUgc3RpbGwgcmVtYWlucyBzYXZlZCBpbiB0aGUgYnJvd3Nlci5cbmFwcC51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgY29uc3QgYXBpUmVxdWVzdCA9ICg8YXBpLlJlcXVlc3Q+cmVxKVxuICAgIC8vIGNvbnZlcnQgdXNlciBzZXNzaW9uIGludG8gdXNlciBjb29raWVcbiAgICBpZiAoYXBpUmVxdWVzdC5zZXNzaW9uICYmIGFwaVJlcXVlc3Quc2Vzc2lvbi5lbWFpbCkge1xuICAgICAgICByZXMuY29va2llKCdlbWFpbCcsIGFwaVJlcXVlc3Quc2Vzc2lvbi5lbWFpbClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlcy5jbGVhckNvb2tpZSgnZW1haWwnKVxuICAgIH1cbiAgICBuZXh0KCk7XG59KTtcblxuYXBwLnVzZSgnLycsIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgIHZhciByZXN1bHQgPSByZXEudXJsLm1hdGNoKC9eXFwvc2VydmVyLiokLylcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMykuZW5kKCc0MDMgRm9yYmlkZGVuJylcbiAgICB9XG5cbiAgICBuZXh0KClcbn0pXG5hcHAudXNlKCcvJywgZXhwcmVzcy5zdGF0aWMoJ2Rpc3QnKSlcblxuLy8gSW5pdGlhbGl6ZSB0aGUgU3dhZ2dlciBtaWRkbGV3YXJlXG5zd2FnZ2VyVG9vbHMuaW5pdGlhbGl6ZU1pZGRsZXdhcmUoc3dhZ2dlckRvYywgZnVuY3Rpb24gKG1pZGRsZXdhcmUpIHtcbiAgICAvLyBJbnRlcnByZXQgU3dhZ2dlciByZXNvdXJjZXMgYW5kIGF0dGFjaCBtZXRhZGF0YSB0byByZXF1ZXN0IC0gbXVzdCBiZSBmaXJzdCBpbiBzd2FnZ2VyLXRvb2xzIG1pZGRsZXdhcmUgY2hhaW5cbiAgICBhcHAudXNlKG1pZGRsZXdhcmUuc3dhZ2dlck1ldGFkYXRhKCkpXG5cbiAgICAvLyBWYWxpZGF0ZSBTd2FnZ2VyIHJlcXVlc3RzXG4gICAgYXBwLnVzZShtaWRkbGV3YXJlLnN3YWdnZXJWYWxpZGF0b3Ioe1xuICAgICAgICB2YWxpZGF0ZVJlc3BvbnNlOiB0cnVlXG4gICAgfSkpO1xuXG4gICAgLy8gUm91dGUgdmFsaWRhdGVkIHJlcXVlc3RzIHRvIGFwcHJvcHJpYXRlIGNvbnRyb2xsZXJcbiAgICBhcHAudXNlKG1pZGRsZXdhcmUuc3dhZ2dlclJvdXRlcihvcHRpb25zKSlcblxuICAgIC8vIFNlcnZlIHRoZSBTd2FnZ2VyIGRvY3VtZW50cyBhbmQgU3dhZ2dlciBVSVxuICAgIGFwcC51c2UobWlkZGxld2FyZS5zd2FnZ2VyVWkoKSlcblxuICAgIC8vIEN1c3RvbSBlcnJvciBoYW5kbGVyIHRoYXQgcmV0dXJucyBKU09OXG4gICAgYXBwLnVzZShmdW5jdGlvbihlcnI6YW55LCByZXE6YW55LCByZXM6YW55LCBuZXh0OmFueSkge1xuICAgICAgICBpZiAodHlwZW9mIGVyciAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBvYmplY3QgaXMgbm90IGFuIEVycm9yLCBjcmVhdGUgYSByZXByZXNlbnRhdGlvbiB0aGF0IGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICAgIGVyciA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBTdHJpbmcoZXJyKSAvLyBDb2VyY2UgdG8gc3RyaW5nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRW5zdXJlIHRoYXQgZXJyLm1lc3NhZ2UgaXMgZW51bWVyYWJsZSAoSXQgaXMgbm90IGJ5IGRlZmF1bHQpXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXJyLCAnbWVzc2FnZScsIHsgZW51bWVyYWJsZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihlcnIub3JpZ2luYWxSZXNwb25zZSkpIHtcbiAgICAgICAgICAgICAgICBlcnIub3JpZ2luYWxSZXNwb25zZSA9IGVyci5vcmlnaW5hbFJlc3BvbnNlLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgcmVzLmpzb24oZXJyKTtcbiAgICB9KTsgICAgXG59KVxuXG5hcHAubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgU2VydmVyIHN0YXJ0ZWQgb24gcG9ydCAke3BvcnR9Li4uYClcbiAgICBkYi5jb25uZWN0VG9Nb25nbygpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgU2VydmVyIGNvbm5lY3RlZCB0byBNb25nb0RCLi4uYClcbiAgICB9KVxufSlcbiJdfQ==
