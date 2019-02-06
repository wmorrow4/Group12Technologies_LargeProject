import mongodb = require('mongodb')

namespace Database {

    export interface Contact {
        belongsTo: string,
        firstname: string,
        lastname: string,
        email: string,
        phone: string
    }

    export interface UserInfo {
        username: string,
        password: string
    }

    export var client:mongodb.MongoClient
    export var db:mongodb.Db
    export var users:mongodb.Collection
    export var contacts:mongodb.Collection

    export async function connectToMongo():Promise<mongodb.Db> {
        if ( this.db ) return Promise.resolve(this.db)
        return mongodb.connect('mongodb://127.0.0.1:27017', {
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
}

export = Database