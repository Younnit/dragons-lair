require('dotenv').config();
const express = require('express')
const session = require('express-session')
const massive = require('massive')

const app = express()
const PORT = 4000
const {CONNECTION_STRING, SESSION_SECRET} = process.env

const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
  }).then(db => {
    console.log("Database connected")
    app.set('db', db);
}).catch(err => console.log(err, 'Database not connected'))

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
)

app.use(express.json)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)