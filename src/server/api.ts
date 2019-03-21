import express = require('express')
import mongodb = require('mongodb')

namespace Api {

    export interface Request extends express.Request {
        session: Session
    }

    export interface Session {
        email: string,
        logid: string,
        type: string //variable that determines if the current logged account is a scheduler and user
    }
}

export = Api