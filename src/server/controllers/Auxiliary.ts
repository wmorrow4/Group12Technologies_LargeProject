{
	"swagger": "2.0",
	"info": {
		"title": "Matterhorn Reservation System",
		"description": "API for schedulerEdit, userEdit, claimAppointment, listSchedules, listAppointments",
		"version": "1.0"
	},
	"produces": [
		"application/json"
	],
	"basePath": "/api",
	"paths": {
		"/ClaimAppointment": {
			"post": {
				"x-swagger-router-controller": "auxiliary",
				"operationId": "ClaimAppointment",
				"tags": [
					"/ClaimAppointment"
				],
				"description": "Create an appointment",
				"parameters": [
					{
						"name": "searchInfo",
						"in": "body",
						"required": true,
						"schema": {
							"type": "object",
							"properties": {
								"search": {
									"type": "string",
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
						"description": "Successful appointment claimed",
						"schema": {
							"$ref": "#/definitions/Success"
						}
					}
				}
			}
		},
		"/ListSchedules": {
			"post": {
				"x-swagger-router-controller": "auxiliary",
				"operationId": "ListSchedules",
				"tags": [
					"/ListSchedules"
				],
				"description": "List created schedules.",
				"parameters": [
					{
						"name": "searchInfo",
						"in": "body",
						"required": true,
						"schema": {
							"type": "object",
							"properties": {
								"search": {
									"type": "string",
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
						"description": "return array of schedule objects",
						"schema": {
							"type": "array",
							"items": {
								"$ref": "#/definitions/Schedule"
							}
						}
					}
				}
			}
		},
		"/UserEditInfo": {
			"post": {
				"x-swagger-router-controller": "auxiliary",
				"operationId": "UserEditInfo",
				"tags": [
					"/UserEditInfo"
				],
				"description": "Apply changes to current user info",
				"parameters": [
					{
						"name": "user info",
						"in": "body",
						"required": true,
						"schema": {
							"allOf": [
								{
									"$ref": "#/definitions/ObjectID"
								},
								{
									"$ref": "#/definitions/UserInfo"
								}
							]
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
						"description": "Successful request and user id.",
						"schema": {
							"$ref": "#/definitions/Success"
						}
					}
				}
			}
		},
		"/SchedulerEditInfo": {
			"post": {
				"x-swagger-router-controller": "auxiliary",
				"operationId": "SchedulerEditInfo",
				"tags": [
					"/SchedulerEditInfo"
				],
				"description": "Apply changes to current scheduler info",
				"parameters": [
					{
						"name": "scheduler info",
						"in": "body",
						"required": true,
						"schema": {
							"allOf": [
								{
									"$ref": "#/definitions/ObjectID"
								},
								{
									"$ref": "#/definitions/SchedulerInfo"
								}
							]
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
						"description": "Successful request and user id.",
						"schema": {
							"$ref": "#/definitions/Success"
						}
					}
				}
			}
		},
		"/ListAppointments": {
			"post": {
				"x-swagger-router-controller": "auxiliary",
				"operationId": "ListAppointments",
				"tags": [
					"/ListAppointments"
				],
				"description": "List claimed appointments.",
				"parameters": [
					{
						"name": "searchInfo",
						"in": "body",
						"required": true,
						"schema": {
							"type": "object",
							"properties": {
								"search": {
									"type": "string",
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
						"description": "return array of Appointment objects",
						"schema": {
							"type": "array",
							"items": {
								"$ref": "#/definitions/Appointment"
							}
						}
					}
				}
			}
		},		
	},
	"definitions": {
		"ObjectID": {
			"properties": {
				"_id": {
					"type": "string"
				}
			},
			"required": [
				"_id"
			]
		},
		"UserInfo": {
			"properties": {
				"firstname": {
					"type": "string"
				},
				"lastname": {
					"type": "string"
				},
				"email": {
					"type": "string"
				},
				"password": {
					"type": "string"
				},
				"appointments": {
					"type": "array"
				},

			},
			"required": [
				"firstname",
				"lastname",
				"email"
				"password"
			]
		},
		"SchedulerInfo": {
			"properties": {
				"schedulerName": {
					"type": "string"
				},
				"username": {
					"type": "string"
				},
				"password": {
					"type": "string"
				},

			},
			"required": [
				"schedulerName",
				"username",
				"password"
			]
		},	
		"Schedule": {
			"properties": {
				"scheduleName": {
					"type": "string"
				},
				"timeRange": {
					"type": "number"
				},
				"appointmentLength": {
					"type": "number"
				},
				"appointmentCapacity": {
					"type": "number"
				},				

			},
		},		
		"Success": {
			"properties": {
				"message": {
					"type": "string"
				}
			},
			"required": [
				"message"
			]
		},
		"Error": {
			"properties": {
				"message": {
					"type": "string"
				}
			},
			"required": [
				"message"
			]
		}
	}
}
