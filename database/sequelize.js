const { Sequelize } = require('sequelize');
const user = require("./User")
const team = require("./Team")
const faculty = require('./Faculty')
const subject = require('./Subject')
const notification = require('./Notifications')


// Option 1: Passing a connection URI
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: (process.env.DATABASE_SSL === 'true') && {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}) // Example for postgres

const Faculty = sequelize.define("Faculty", faculty)
const Subject = sequelize.define("Subject", subject)
const User = sequelize.define("User", user)
const Team = sequelize.define("Team", team)
const Notification = sequelize.define("Notification", notification)

// USER
User.belongsTo(Faculty, { foreignKey: 'FacultyId' })

// TEAM and USER
const Team_Member = sequelize.define('Team_Member', {}, { timestamps: true });
User.belongsToMany(Team, { through: Team_Member, foreignKey: "userId" });
Team.belongsToMany(User, { through: Team_Member, foreignKey: "teamId" });

//TEAM
Team.belongsTo(User, { foreignKey: 'TeamAdmin' })
Team.belongsTo(Subject, { foreignKey: 'SubjectId' })

// SUBJECT
Subject.belongsTo(Faculty, { foreignKey: 'FacultyId' })

// NOTIFICATIONS
Notification.belongsTo(User, { foreignKey: 'UserId' })

module.exports = { sequelize, User, Team, Team_Member, Subject, Faculty, Notification }