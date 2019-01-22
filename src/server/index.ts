import express = require('express')
import swaggerTools = require('swagger-tools')

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = require('../assets/swagger.json')

const app = express()
const port = process.env.PORT || 8080

// swaggerRouter configuration
var options = {
    controllers: `${__dirname}/controllers`,
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
}

app.use('/', (req, res, next) => {
    var result = req.url.match(/^\/server.*$/)
    if (result) {
        return res.status(403).end('403 Forbidden')
    }
    next()
})
app.use('/', express.static('dist'))

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata())

    // Validate Swagger requests
    app.use(middleware.swaggerValidator({
        validateResponse: true
    }));

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options))

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi())

    // Custom error handler that returns JSON
    app.use(function(err:any, req:any, res:any, next:any) {
        if (typeof err !== 'object') {
            // If the object is not an Error, create a representation that appears to be
            err = {
                message: String(err) // Coerce to string
            };
        } else {
            // Ensure that err.message is enumerable (It is not by default)
            Object.defineProperty(err, 'message', { enumerable: true });
        }
        res.statusCode = 500;
        res.json(err);
    });    
})

app.listen(port, () => {
    console.log(`Server started on port ${port}...`)
})
