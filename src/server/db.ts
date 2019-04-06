import mongodb = require('mongodb')

namespace Database {

   export interface ObjectID {
       _id: string

   }

   export interface Scheduler {
       schedulerID: mongodb.ObjectID
       username: string,
       password: string,
       name: string
   }
   
    export interface Schedule {
        s_id: mongodb.ObjectID
        schedulerID: mongodb.ObjectID
        schedule_name: string,
        average_appointment_length: string,
        max_capacity: number,
        M: string,
        T: string,
        W: string,
        Th: string,
        F: string,
        S: string,
        Su: string
    }

    export interface Reservation {
        UserID: mongodb.ObjectID
        ScheduleID: string,
        Date: string,
        Time: string
    }

    export interface User {
        _id: mongodb.ObjectID
        username: string,
        password: string,
        email: string
    }

    export interface Search {
        search: string
    }

    export var client:mongodb.MongoClient
    export var db:mongodb.Db
    export var Reservation:mongodb.Collection<Reservation>
    export var Schedule:mongodb.Collection<Schedule>
    export var Scheduler:mongodb.Collection<Scheduler>
    export var User:mongodb.Collection<User>

    export async function connectToMongo():Promise<mongodb.Db> {
        if ( this.db ) return Promise.resolve(this.db)
        return mongodb.connect('mongodb://localhost:27017', {
            bufferMaxEntries:   0,
            reconnectTries:     5000,
            useNewUrlParser: true
        }).then(client => {
            this.client = client
            this.db = this.client.db("mean")
            this.Reservation = this.db.collection('Reservation')
            this.Schedule = this.db.collection('Schedule')
            this.User = this.db.collection('User')
            this.Scheduler = this.db.collection('Scheduler')
            return this.db
        })
    }

    export function disconnectFromMongo() {
        client.close()
    }
}

export = Database