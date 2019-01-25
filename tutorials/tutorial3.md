### Tutorial 3 - Adding a REST API

After adding the express server to the project in the file "src/server/index.ts" I hooked up a REST API validation middleware called Swagger.

What this allows us to do is define our REST API in a document "src/assets/swagger.json" and the express web server will check incoming requests and outgoing responses to make sure they match the spec and then routes them to the appropriate function on the server in the "controllers" directory to be handled.

The current version of swagger.json is a demo for a Weather API. We're going to change this ASAP. You can see in there where URL endpoints are defined and how they relate to files in the "controllers" directory.

Some things to look for:

1) The base path property is "/api" so all our REST APIs will start with "/api"
2) The only path defined currently in the api is "/weather" so the full api will be "/api/weather"
3) The HTTP method/verb for the weather API is GET. You can see that right below the line that reads: "/weather": {
4) x-swagger-router-controller is "Weather." That means that swagger will load "src/server/controllers/Weather.js" when looking for that specific REST API. So you should go look in that file for how it's implemented.
5) operationId is "getWeather." That is the javascript function inside Weather.js that will be executed when a browser asks for that URL.
6) "parameters" lists the allowable parameters for the REST API. If your request doesn't match it will complain and tell you exactly what's missing. This is the power of Swagger.io.
7) "responses" lists all the ways (HTTP codes) that the REST API can respond with and what those objects have to look like. 404 is the code for page not found. 500 is for an internal server error. 200 is the code for success. Google HTTP response codes for a list of commonly used codes. EVERY possible response from your REST API needs to have a matching definition which is why there is an entry called "default"
8) There is also a "definitions" section that lets you define commonly used datastructures so you can refer to them throughout your REST API.

Okay...enough chit chat. Let's add a REST API

Add the following json to your swagger.json file inside the "paths" object.

      "/signup": {
        "post": {
          "x-swagger-router-controller": "login",
          "operationId": "signup",
          "tags": ["/signup"],
          "description": "Creates a new user",
          "parameters": [
            {
              "name": "userinfo",
              "in": "body",
              "required": true,
              "schema": {
                "type": "object",
                "required": [
                  "username",
                  "password",
                  "email"
                ],
                "properties": {
                  "username": {
                    "type": "string"
                  },
                  "password": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  }
                }
              }
            }
          ],
          "responses": {
            "default": {
              "description": "Invalid request.",
              "schema": {
                "$ref": "#/definitions/Error"
              }
            },
            "200": {
              "description": "Successful request.",
              "schema": {
                "$ref": "#/definitions/Success"
              }
            }
          }
        }
      },

Then add the following json to the definitions section:

      "Success": {
        "properties": {
          "message": {
            "type": "string"
          }
        },
        "required": ["message"]
      },

Then see if you can get it to send back some data on your own with the information I've provided.

Remember after restarting your server using "Ctrl+C" to stop the existing server, running "gulp" to rebuild and "node dist/server/index.js" to start it up again, you can go to "http://localhost:8080/docs" to test out your REST API.

Don't worry about any database stuff for right now, just try to get the REST API to return some valid JSON.

