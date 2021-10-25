const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { getUserById, getUserByEmail, getUserPassById } = require('./utils/getUser')


function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (!user) {
            return done(null, false, { message: 'no user with that email' })
        }

        try {
            const pass = await getUserPassById(user.id)
            console.log(pass);
            if (await bcrypt.compare(password, pass.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    const strategy = new LocalStrategy({ usernameField: "email" },
        authenticateUser);
    passport.use(strategy)
    console.log(strategy);
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id)
        return done(null, user)
    })
}



module.exports = initialize