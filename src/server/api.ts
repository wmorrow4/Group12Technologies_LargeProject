import express = require('express')
import mongodb = require('mongodb')

namespace Api {

    export interface Request extends express.Request {
        session: Session
    }

    export interface Session {
        username: string,
        userid: string
    }
}

export = Api