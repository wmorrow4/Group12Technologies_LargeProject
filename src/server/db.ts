import mongodb = require('mongodb')

class Database {

    private static client:mongodb.MongoClient
    private static db:mongodb.Db
    public static users:mongodb.Collection
    public static contacts:mongodb.Collection

    static async connectToMongo():Promise<mongodb.Db> {
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