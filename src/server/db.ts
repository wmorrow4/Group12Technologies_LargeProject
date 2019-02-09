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
        phone: string
    }

    export interface UserInfo {
        _id: mongodb.ObjectID
        username: string,
        password: string
    }

    export var client:mongodb.MongoClient
    export var db:mongodb.Db
    export var users:mongodb.Collection<UserInfo>
    export var contacts:mongodb.Collection<Contact>

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

    export function disconnectFromMongo() {
        client.close()
    }
}

export = Database