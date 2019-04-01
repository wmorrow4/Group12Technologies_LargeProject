import mongodb = require('mongodb')

namespace Database {

    export interface ObjectID {
        _id: string
    }

    export interface Contact {
        belongsTo: mongodb.ObjectID,
        firstname: string,
        lastname: string,
        email: string,
        phone: string,
        pic?: string,
    }

    export interface UserInfo {
        _id: mongodb.ObjectID
        firstname: string,
        lastname: string,
        email: string,
        password: string
    }

    export interface Search {
        search: string
    }

    export interface SchedulersInfo{
        belongsTo: mongodb.ObjectID,
        group: string,
        email: string,
        password: string
    }
    export interface Schedules{
        /* ToDo */
        
    }
    export interface Reservations{
        /* ToDo */
    }

    export var client:mongodb.MongoClient
    export var db:mongodb.Db
    export var users:mongodb.Collection<UserInfo>
    export var contacts:mongodb.Collection<Contact>  //dont need this anymore but left for reference idk why
    export var schedulers:mongodb.Collection<SchedulersInfo>   // THESE LINES ARE OUR DATABSE COLLECTIONS
    export var schedules:mongodb.Collection<Schedules>
    export var reservations:mongodb.Collection<Reservations>

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
            this.schedulers = this.db.collection('schedulers')
            this.schedules = this.db.collection('schedules')
            this.reservations = this.db.collection('reservations')
            return this.db
        })
    }

    export function disconnectFromMongo() {
        client.close()
    }
}

export = Database
