import mongodb = require('mongodb')
import db = require('./db')

async function go() {
    await db.connectToMongo()
    if (await db.db.listCollections({ name: 'Scheduler' }).hasNext())
        await db.Scheduler.drop()
    if (await db.db.listCollections({ name: 'Schedules' }).hasNext())
        await db.Schedule.drop()
    if (await db.db.listCollections({ name: 'Reservations' }).hasNext())
        await db.Reservation.drop()
    db.disconnectFromMongo()
    return "Success!!"
}
go().then(console.log).catch(console.error)
