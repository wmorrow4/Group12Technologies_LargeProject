import express = require('express')
import mongodb = require('mongodb')

namespace Api {

    export interface Request extends express.Request {
        session: Session
    }

    export interface Session {
        email: string,
        logid: string,
        type: string
    }
}

export = Api