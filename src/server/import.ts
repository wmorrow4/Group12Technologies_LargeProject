import mongodb = require('mongodb')
import db = require('./db')

const schedulers = [
    
]

const users = [

]

const schedules = [

]

const reservations = [
	
]

async function go() {
    await db.connectToMongo()
    if (await db.db.listCollections({ name: 'users' }).hasNext())
        await db.users.drop()
    if (await db.db.listCollections({ name: 'contacts' }).hasNext())
        await db.contacts.drop()
    await Promise.all(users.map(async user => {
        return await db.users.insertOne(user)
    }))
    await Promise.all(contacts.map(async (contact, idx)=> {
        return await db.contacts.insertOne({
            belongsTo: users[idx % users.length]._id,
            firstname: contact.firstname,
            lastname: contact.lastname,
            email: contact.email,
			phone: contact.phone,
			pic: contact.pic
        })
    }))
    db.disconnectFromMongo()
    return "Success!!"
}
go().then(console.log).catch(console.error)
