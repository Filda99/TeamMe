const express = require("express")
const { sequelize, User } = require("./database/sequelize")
const routes = require('./routes')
const session = require('express-session')
var path = require('path');
const { log } = require("console");
const router = require("./routes/user");
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


/**
 * APP Session
 */
app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: 'supersecretChangeITLATER',
    cookie: {
        maxAge: Number(process.env.SESS_LIFETIME),
        sameSite: true,
        secure: false,  // CHANGE IF HTTPS
    }
}))


/**
 * Redirections
 */

/**
 * Redirect to login page 
 */
const redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
        res.redirect('/login')
    } else {
        next()
    }
}

/**
 * Redirect to dashboard page
 */
const redirectHome = (req, res, next) => {
    if (req.session.userID) {
        res.redirect('/dashboard')
    } else {
        next()
    }
}

/**
 * Pages and routes
 */
app.get("/", (req, res) => {
    const { userID } = req.session

    console.log(req.session);
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.get('/dashboard', redirectLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/dashboard.html'));
})

app.get('/login', redirectHome, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
})

app.get('/register', redirectHome, (req, res) => {
    res.sendFile(path.join(__dirname, '/public/register.html'));
})

app.use('/user', routes.user)

app.post('/login', redirectHome, async (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        try {
            let user = await User.findOne({
                where: {    // TODO: validation
                    email: email,
                    password: password
                }
            })

            if (user instanceof User) {
                req.session.userID = user.id
                console.log('SES_ID', req.session.userID);
                return res.redirect('/dashboard')
            }
        } catch (err) {
            res.send(err);
        }

    }
    res.redirect('/login')
})

app.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard')
        }
        res.clearCookie(process.env.SESS_NAME)
    })
})

sequelize.sync({ logging: false, force: false }).then(() => {
    console.log('database in sync')
})
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))