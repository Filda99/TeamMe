/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                                      Main router index.js                                         
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Main file of the system. 
 *      
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.10.2021
 * 
 */

const dotenv = require('dotenv').config()

/****************************************
 *              Includes                *
 ***************************************/
/* Express */
const express = require("express")
const session = require('express-session')
const flash = require('express-flash')
const app = express()

/* Database */
const { sequelize } = require("./database/sequelize")
const routes = require('./routes')

/* Utils */
const { checkAuthenticated, checkNotAuthenticated } = require('./utils/isAuthenticated')

/* Authentication */
const methodOverride = require('method-override')
const passport = require('passport')
const initializePassport = require('./passport-config')
const { getUserById } = require('./utils/getUser')
const { getUserNotifi } = require('./controllers/notification.controller')
initializePassport(passport)


/****************************************
 *         App uses and session         *
 ***************************************/

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())

/**
 * APP Session
 */
app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: Number(process.env.SESS_LIFETIME),
        sameSite: true,
        secure: false,  // CHANGE IF HTTPS
    }
}))
app.use(passport.initialize())
app.use(passport.session())


/****************************************
 *           Pages and routes           *
 ***************************************/
app.get("/", async (req, res) => {
    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('index', {userLogged, notification})
})

app.get('/login', checkNotAuthenticated, async (req, res) => {
    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('registration', {userLogged, notification})
})

app.get('/register', checkNotAuthenticated, async (req, res) => {
    let userLogged = false
    let notification = null;
    if (req.user) {
        userLogged = true
        notification = await getUserNotifi(req.user.id)
    }

    res.render('registration', {userLogged, notification})
})

app.get('/my_profile', checkAuthenticated, async (req, res) => {
    const user = await getUserById(req.user.id)
    res.redirect(`/user/${user.email}`)
})

app.use('/user', routes.user)
app.use('/team', routes.team)
app.use('/faculty', routes.faculty)
app.use('/subject', routes.subject)
app.use('/notification', routes.notification)

app.post('/login', passport.authenticate('local', {
    successRedirect: 'my_profile',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

sequelize.sync({ logging: false, force: false }).then(() => {
    console.log('database in sync')
})
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))