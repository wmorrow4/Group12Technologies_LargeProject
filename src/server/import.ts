import mongodb = require('mongodb')
import db = require('./db')

const users = [
    {
        "_id": mongodb.ObjectID.createFromTime(new Date().getTime()),
        "username": "nik",
        "password": "password",
    },
    {
        "_id": mongodb.ObjectID.createFromTime(new Date().getTime()),
        "username": "nik2",
        "password": "password",
    },
    {
        "_id": mongodb.ObjectID.createFromTime(new Date().getTime()),
        "username": "nik3",
        "password": "password",
    },
    {
        "_id": mongodb.ObjectID.createFromTime(new Date().getTime()),
        "username": "nik4",
        "password": "password",
    },
    {
        "_id": mongodb.ObjectID.createFromTime(new Date().getTime()),
        "username": "nik5",
        "password": "password",
    },
]

const contacts = [
	{
		"firstname": "Geraldine",
		"lastname": "Kemp",
		"email": "mauris.sapien@hendrerit.org",
		"phone": "746-8985"
	},
	{
		"firstname": "Aladdin",
		"lastname": "Henderson",
		"email": "Suspendisse.aliquet.molestie@posuerecubilia.ca",
		"phone": "561-8991"
	},
	{
		"firstname": "Riley",
		"lastname": "Jefferson",
		"email": "velit.Quisque@nectempusscelerisque.com",
		"phone": "218-7255"
	},
	{
		"firstname": "Julie",
		"lastname": "Porter",
		"email": "nibh@nunc.org",
		"phone": "1-808-477-6734"
	},
	{
		"firstname": "Kane",
		"lastname": "Oconnor",
		"email": "porttitor.scelerisque@SuspendisseduiFusce.ca",
		"phone": "1-730-852-6453"
	},
	{
		"firstname": "Cairo",
		"lastname": "Strong",
		"email": "Donec.tempus@rutrummagna.ca",
		"phone": "1-538-603-7575"
	},
	{
		"firstname": "Troy",
		"lastname": "Good",
		"email": "velit.dui@tinciduntorci.co.uk",
		"phone": "243-5201"
	},
	{
		"firstname": "Emery",
		"lastname": "Britt",
		"email": "vitae.nibh.Donec@Nulla.edu",
		"phone": "898-4357"
	},
	{
		"firstname": "Reece",
		"lastname": "Vinson",
		"email": "non.luctus@eutemporerat.ca",
		"phone": "684-4897"
	},
	{
		"firstname": "Tiger",
		"lastname": "Blair",
		"email": "nulla.magna.malesuada@metusAenean.edu",
		"phone": "1-147-781-7548"
	},
	{
		"firstname": "Oscar",
		"lastname": "Powers",
		"email": "arcu@dolor.ca",
		"phone": "1-744-985-0726"
	},
	{
		"firstname": "Willow",
		"lastname": "Burns",
		"email": "augue@montesnascetur.org",
		"phone": "384-4623"
	},
	{
		"firstname": "Colt",
		"lastname": "Mitchell",
		"email": "elementum@Proinnislsem.org",
		"phone": "917-4697"
	},
	{
		"firstname": "Theodore",
		"lastname": "Blanchard",
		"email": "Donec.dignissim.magna@hendreritconsectetuer.org",
		"phone": "1-855-570-0970"
	},
	{
		"firstname": "Holmes",
		"lastname": "Meyers",
		"email": "a.nunc.In@dictumProin.org",
		"phone": "1-276-886-4628"
	},
	{
		"firstname": "Shaine",
		"lastname": "Larson",
		"email": "porttitor.vulputate@eget.edu",
		"phone": "1-455-270-2591"
	},
	{
		"firstname": "Daniel",
		"lastname": "Kirk",
		"email": "mollis.non@tortorat.ca",
		"phone": "313-5085"
	},
	{
		"firstname": "Gannon",
		"lastname": "Malone",
		"email": "aliquet.Phasellus@elitsed.com",
		"phone": "927-4460"
	},
	{
		"firstname": "Kylan",
		"lastname": "Sharpe",
		"email": "Aliquam@nasceturridiculusmus.ca",
		"phone": "677-1272"
	},
	{
		"firstname": "Ahmed",
		"lastname": "Craig",
		"email": "feugiat@euismodet.ca",
		"phone": "816-9895"
	},
	{
		"firstname": "Nigel",
		"lastname": "Cain",
		"email": "eu@dictummi.ca",
		"phone": "934-0979"
	},
	{
		"firstname": "Kieran",
		"lastname": "Fox",
		"email": "fames@tristiqueaceleifend.com",
		"phone": "1-181-809-8848"
	},
	{
		"firstname": "Juliet",
		"lastname": "Nunez",
		"email": "Donec.porttitor@idrisusquis.com",
		"phone": "758-2063"
	},
	{
		"firstname": "Valentine",
		"lastname": "Ewing",
		"email": "pede.sagittis@fermentum.org",
		"phone": "1-672-556-0191"
	},
	{
		"firstname": "Morgan",
		"lastname": "Rowland",
		"email": "dolor@auctornunc.com",
		"phone": "136-4990"
	},
	{
		"firstname": "Rooney",
		"lastname": "Oliver",
		"email": "aliquet@Vivamusnisi.org",
		"phone": "374-7649"
	},
	{
		"firstname": "Anika",
		"lastname": "Hewitt",
		"email": "Cras.vulputate@commodohendreritDonec.edu",
		"phone": "224-8590"
	},
	{
		"firstname": "Deirdre",
		"lastname": "Dyer",
		"email": "aliquet.Phasellus.fermentum@sagittisplacerat.edu",
		"phone": "1-957-271-3155"
	},
	{
		"firstname": "Laith",
		"lastname": "Jefferson",
		"email": "lobortis@atlibero.org",
		"phone": "857-2194"
	},
	{
		"firstname": "Byron",
		"lastname": "Fox",
		"email": "purus.ac@rhoncus.net",
		"phone": "755-8501"
	},
	{
		"firstname": "Colby",
		"lastname": "Schmidt",
		"email": "interdum@ac.co.uk",
		"phone": "1-343-729-7297"
	},
	{
		"firstname": "Nolan",
		"lastname": "Pacheco",
		"email": "elit.a.feugiat@duiFuscealiquam.net",
		"phone": "244-1252"
	},
	{
		"firstname": "Paula",
		"lastname": "Gilmore",
		"email": "Sed.eget@Aenean.net",
		"phone": "1-714-301-8813"
	},
	{
		"firstname": "Leonard",
		"lastname": "Barrett",
		"email": "Vivamus.rhoncus.Donec@nonummyultriciesornare.org",
		"phone": "1-449-753-6733"
	},
	{
		"firstname": "Porter",
		"lastname": "Blackwell",
		"email": "Integer.in@atvelitCras.com",
		"phone": "1-145-579-2479"
	},
	{
		"firstname": "Liberty",
		"lastname": "Campbell",
		"email": "sem@tortornibh.org",
		"phone": "1-568-648-7461"
	},
	{
		"firstname": "Reece",
		"lastname": "Stevenson",
		"email": "diam@justo.edu",
		"phone": "1-104-621-2575"
	},
	{
		"firstname": "Oliver",
		"lastname": "Duran",
		"email": "netus.et@egestasligula.co.uk",
		"phone": "1-584-324-8775"
	},
	{
		"firstname": "Jerry",
		"lastname": "Murray",
		"email": "pede@Nullasemper.org",
		"phone": "1-674-839-4790"
	},
	{
		"firstname": "Alexandra",
		"lastname": "Figueroa",
		"email": "arcu.Sed@turpisegestas.ca",
		"phone": "1-750-429-2853"
	},
	{
		"firstname": "Beau",
		"lastname": "Wallace",
		"email": "natoque.penatibus.et@mitempor.edu",
		"phone": "523-0679"
	},
	{
		"firstname": "Urielle",
		"lastname": "Bell",
		"email": "enim.Etiam@non.com",
		"phone": "1-777-525-7665"
	},
	{
		"firstname": "Aquila",
		"lastname": "Boyle",
		"email": "semper.et.lacinia@auctor.ca",
		"phone": "181-8054"
	},
	{
		"firstname": "Brent",
		"lastname": "Hansen",
		"email": "est@sedpede.org",
		"phone": "789-6427"
	},
	{
		"firstname": "Erin",
		"lastname": "Humphrey",
		"email": "massa@posuere.edu",
		"phone": "1-409-757-0204"
	},
	{
		"firstname": "Roary",
		"lastname": "Whitfield",
		"email": "lacinia.orci@Nunclectuspede.net",
		"phone": "1-851-989-5698"
	},
	{
		"firstname": "Lydia",
		"lastname": "Campos",
		"email": "Nunc@Sed.co.uk",
		"phone": "1-684-166-2600"
	},
	{
		"firstname": "Stewart",
		"lastname": "Graves",
		"email": "arcu.Morbi.sit@molestiearcu.edu",
		"phone": "1-606-673-4698"
	},
	{
		"firstname": "Graham",
		"lastname": "Fox",
		"email": "elementum.dui.quis@ornare.org",
		"phone": "171-6636"
	},
	{
		"firstname": "Calvin",
		"lastname": "Zimmerman",
		"email": "tempor@Maurisnon.ca",
		"phone": "810-0516"
	},
	{
		"firstname": "Quinn",
		"lastname": "Edwards",
		"email": "egestas.blandit@purus.com",
		"phone": "237-2836"
	},
	{
		"firstname": "Eaton",
		"lastname": "Byers",
		"email": "Donec@parturientmontesnascetur.com",
		"phone": "1-951-821-8406"
	},
	{
		"firstname": "Caldwell",
		"lastname": "Daugherty",
		"email": "eu.tellus.Phasellus@egestasblandit.edu",
		"phone": "1-559-570-5035"
	},
	{
		"firstname": "Owen",
		"lastname": "Norman",
		"email": "ac.metus@ultriciesligulaNullam.edu",
		"phone": "531-9750"
	},
	{
		"firstname": "Aretha",
		"lastname": "Figueroa",
		"email": "porta@sed.net",
		"phone": "690-2077"
	},
	{
		"firstname": "Zoe",
		"lastname": "Glenn",
		"email": "nascetur.ridiculus@egetvolutpatornare.net",
		"phone": "1-109-307-9336"
	},
	{
		"firstname": "Alden",
		"lastname": "Ashley",
		"email": "aliquam.eros.turpis@Donecfelis.ca",
		"phone": "515-6426"
	},
	{
		"firstname": "Ingrid",
		"lastname": "Combs",
		"email": "dolor.sit.amet@ligulaNullam.co.uk",
		"phone": "1-423-518-7952"
	},
	{
		"firstname": "Cleo",
		"lastname": "Jimenez",
		"email": "Sed.et.libero@diam.ca",
		"phone": "1-497-895-0198"
	},
	{
		"firstname": "Shana",
		"lastname": "Wall",
		"email": "placerat.augue.Sed@luctus.edu",
		"phone": "562-8228"
	},
	{
		"firstname": "Armando",
		"lastname": "Mckay",
		"email": "dictum.eu@infaucibusorci.edu",
		"phone": "1-950-749-0576"
	},
	{
		"firstname": "Imelda",
		"lastname": "Franco",
		"email": "sit.amet@felisDonectempor.org",
		"phone": "200-8726"
	},
	{
		"firstname": "Savannah",
		"lastname": "Hancock",
		"email": "porttitor@mauris.co.uk",
		"phone": "1-226-233-9526"
	},
	{
		"firstname": "Nichole",
		"lastname": "Carr",
		"email": "ante.blandit@blandit.net",
		"phone": "625-6187"
	},
	{
		"firstname": "Prescott",
		"lastname": "Whitney",
		"email": "arcu@Integerinmagna.co.uk",
		"phone": "1-942-685-6103"
	},
	{
		"firstname": "Larissa",
		"lastname": "Mercer",
		"email": "eu@augue.ca",
		"phone": "575-4395"
	},
	{
		"firstname": "Zephania",
		"lastname": "Farley",
		"email": "adipiscing.lacus@aliquet.ca",
		"phone": "697-6966"
	},
	{
		"firstname": "Finn",
		"lastname": "England",
		"email": "magna.Duis@tristique.net",
		"phone": "219-9250"
	},
	{
		"firstname": "Ulric",
		"lastname": "Chapman",
		"email": "non.vestibulum.nec@Maecenasmalesuadafringilla.org",
		"phone": "135-5850"
	},
	{
		"firstname": "Bevis",
		"lastname": "Thomas",
		"email": "Phasellus.dapibus@acliberonec.com",
		"phone": "1-660-630-2922"
	},
	{
		"firstname": "Molly",
		"lastname": "Tran",
		"email": "est.vitae.sodales@faucibusorci.edu",
		"phone": "1-599-532-1994"
	},
	{
		"firstname": "Quamar",
		"lastname": "Newman",
		"email": "primis.in.faucibus@malesuadaut.edu",
		"phone": "1-103-291-7203"
	},
	{
		"firstname": "Cole",
		"lastname": "Woodward",
		"email": "amet.diam@idblandit.net",
		"phone": "866-8123"
	},
	{
		"firstname": "Nevada",
		"lastname": "Mclaughlin",
		"email": "malesuada@magnaDuis.ca",
		"phone": "1-199-690-9912"
	},
	{
		"firstname": "Xandra",
		"lastname": "Peters",
		"email": "Cras.interdum.Nunc@posuerevulputatelacus.co.uk",
		"phone": "719-2680"
	},
	{
		"firstname": "Ina",
		"lastname": "Gay",
		"email": "nascetur.ridiculus.mus@ullamcorpereu.co.uk",
		"phone": "277-8582"
	},
	{
		"firstname": "Kiayada",
		"lastname": "Bernard",
		"email": "Donec@vestibulumloremsit.edu",
		"phone": "1-564-192-6390"
	},
	{
		"firstname": "Calvin",
		"lastname": "Joyce",
		"email": "eleifend@amet.org",
		"phone": "428-1421"
	},
	{
		"firstname": "Hedley",
		"lastname": "Holder",
		"email": "eu.odio@tellusPhasellus.net",
		"phone": "733-0158"
	},
	{
		"firstname": "Amanda",
		"lastname": "Ramos",
		"email": "Donec.felis@blandit.co.uk",
		"phone": "1-726-603-7410"
	},
	{
		"firstname": "Melissa",
		"lastname": "Lloyd",
		"email": "nibh@penatibuset.co.uk",
		"phone": "1-164-375-3031"
	},
	{
		"firstname": "Hadley",
		"lastname": "Giles",
		"email": "dolor.dolor@vulputate.net",
		"phone": "718-9763"
	},
	{
		"firstname": "Kirsten",
		"lastname": "Osborn",
		"email": "ultrices.iaculis.odio@accumsansedfacilisis.co.uk",
		"phone": "1-577-941-0894"
	},
	{
		"firstname": "Noelle",
		"lastname": "Byers",
		"email": "lectus.sit@turpisnonenim.edu",
		"phone": "1-458-402-6122"
	},
	{
		"firstname": "Solomon",
		"lastname": "Best",
		"email": "sodales.purus.in@aliquet.com",
		"phone": "245-4531"
	},
	{
		"firstname": "Xaviera",
		"lastname": "Delaney",
		"email": "elit.elit@hendreritidante.edu",
		"phone": "694-0987"
	},
	{
		"firstname": "Unity",
		"lastname": "Chambers",
		"email": "eget@eueros.edu",
		"phone": "1-117-696-4851"
	},
	{
		"firstname": "Carlos",
		"lastname": "Dalton",
		"email": "massa.Mauris@penatibus.edu",
		"phone": "133-8250"
	},
	{
		"firstname": "Marvin",
		"lastname": "Whitfield",
		"email": "et@venenatis.org",
		"phone": "537-6625"
	},
	{
		"firstname": "Jennifer",
		"lastname": "Stevens",
		"email": "penatibus@nibhvulputate.com",
		"phone": "1-325-172-5634"
	},
	{
		"firstname": "Fredericka",
		"lastname": "Hale",
		"email": "cursus@tellus.net",
		"phone": "1-156-963-7231"
	},
	{
		"firstname": "Mallory",
		"lastname": "Luna",
		"email": "gravida@sapiengravidanon.com",
		"phone": "1-201-430-5318"
	},
	{
		"firstname": "Ethan",
		"lastname": "Bird",
		"email": "laoreet@Pellentesquetincidunt.ca",
		"phone": "990-3960"
	},
	{
		"firstname": "Halla",
		"lastname": "Phillips",
		"email": "leo@Vestibulumante.co.uk",
		"phone": "677-0992"
	},
	{
		"firstname": "Randall",
		"lastname": "Preston",
		"email": "malesuada.fames@Etiam.co.uk",
		"phone": "569-1324"
	},
	{
		"firstname": "Ferris",
		"lastname": "Neal",
		"email": "libero.at@velconvallis.edu",
		"phone": "1-900-746-3000"
	},
	{
		"firstname": "Kelly",
		"lastname": "Griffith",
		"email": "Nullam.vitae.diam@auctorullamcorpernisl.edu",
		"phone": "824-5484"
	},
	{
		"firstname": "Ruby",
		"lastname": "Wells",
		"email": "risus.Donec.egestas@vitae.net",
		"phone": "1-536-898-5808"
	},
	{
		"firstname": "Kim",
		"lastname": "Stout",
		"email": "a.mi.fringilla@Nuncullamcorpervelit.com",
		"phone": "1-805-631-9504"
	},
	{
		"firstname": "Karyn",
		"lastname": "Knapp",
		"email": "lobortis@consectetuereuismodest.co.uk",
		"phone": "1-476-651-3008"
	}
]

async function go() {
    await db.connectToMongo()
    await db.users.drop()
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
        })
    }))
    db.disconnectFromMongo()
    return "Success!!"
}
go().then(console.log).catch(console.error)
