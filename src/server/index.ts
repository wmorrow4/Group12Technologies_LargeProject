import express = require('express')
import swaggerTools = require('swagger-tools')
import bodyParser = require('body-parser')
import cookieParser = require('cookie-parser')
import session = require('express-session')

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = require('../assets/swagger.json')

const app = express()
const port = process.env.PORT || 8080

// swaggerRouter configuration
var options = {
    controllers: `${__dirname}/controllers`,
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
}

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    name: 'user_sid',
    secret: 'somerandomstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: false
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && req.session && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

app.use('/', (req, res, next) => {
    var result = req.url.match(/^\/server.*$/)
    if (result) {
        return res.status(403).end('403 Forbidden')
    }

    var result = req.url.match(/^.*login.*$/) || req.url.match(/^.*docs.*$/) || req.url.match(/^.*css$/) || req.url.match(/^.*js$/) || req.url.match(/^\/api\/.*$/)
    if (!result && (!req.session || !req.session.user || !req.cookies.user_sid)) {
        res.redirect('/login.html')
    } else {
        next()
    }    
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
