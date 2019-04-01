import mongodb = require('mongodb')

namespace Database {

   export interface ObjectID {
       _id: string

   }
   
    export interface Schedule {
        _id: mongodb.ObjectID
        schedulerID: string,
        schedule_name: string,
        average_appointment_length: string,
        max_capacity: string,
        M: string,
        T: string,
        W: string,
        Th: string,
        F: string,
        S: string,
        Su: string
    }

    export interface Reservation {
        _id: mongodb.ObjectID
        UserID: string,
        ScheduleID: string,
        Date: string,
        Time: string

    }

    export interface UserInfo {
        _id: mongodb.ObjectID
        username: string,
        password: string
    }

    export interface Search {
        search: string
    }

    export var client:mongodb.MongoClient
    export var db:mongodb.Db
    export var users:mongodb.Collection<UserInfo>
    export var contacts:mongodb.Collection<Contact>

    export async function connectToMongo():Promise<mongodb.Db> {
        if ( this.db ) return Promise.resolve(this.db)
        return mongodb.connect('mongodb://localhost:27017', {
            bufferMaxEntries:   0,
            reconnectTries:     5000,
            useNewUrlParser: true
        }).then(client => {
            this.client = client
            this.db = this.client.db("mean")
            this.users = this.db.collection('users')
            this.contacts = this.db.collection('contacts')
            return this.db
        })
    }

    export function disconnectFromMongo() {
        client.close()
    }
}

export = Database