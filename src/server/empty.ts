import mongodb = require('mongodb')
import db = require('./db')

async function go() {
    await db.connectToMongo()
    await db.users.deleteMany({})
    await db.contacts.deleteMany({})
    db.disconnectFromMongo()
    return "Success!!"
}
go().then(console.log).catch(console.error)
