import mongodb = require('mongodb')
import db = require('./db')

async function go() {
    await db.connectToMongo()
    if (await db.db.listCollections({ name: 'users' }).hasNext())
        await db.users.drop()
    if (await db.db.listCollections({ name: 'contacts' }).hasNext())
        await db.contacts.drop()
    db.disconnectFromMongo()
    return "Success!!"
}
go().then(console.log).catch(console.error)
