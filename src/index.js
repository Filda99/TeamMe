if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

/****************************************
 *              Includes                *
 ***************************************/
/* Express */
const express = require("express")
const session = require('express-session')
const flash = require('express-flash')
const app = express()

/* System */
const path = require('path')

/* Database */
const { sequelize } = require("./database/sequelize")
const routes = require('./routes')

/* Utils */
const { checkAuthenticated, checkNotAuthenticated } = require('./utils/isAuthenticated')

/* Authentication */
const methodOverride = require('method-override')
const passport = require('passport')
const initializePassport = require('./passport-config')
initializePassport(passport)


/****************************************
 *         App uses and session         *
 ***************************************/


 app.use(express.static(path.join(__dirname, 'public')));
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
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/registration.html'));
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/registration.html'));
})

app.get('/my_profile', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/my_profile.html'));
})

app.get('/teams', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/teams.html'));
})

app.use('/user', routes.user)
app.use('/team', routes.team)
app.use('/faculty', routes.faculty)
app.use('/subject', routes.subject)

app.post('/login', passport.authenticate('local', {
    successRedirect: '/my_profile',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

sequelize.sync({ logging: false, force: true }).then(() => {
    console.log('database in sync')
})
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))