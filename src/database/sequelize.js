const { Sequelize } = require('sequelize');
const user = require("./User")
const team = require("./Team")
const faculty = require('./Faculty')
const project = require('./Project')
const subject = require('./Subject')

// Option 1: Passing a connection URI
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/db_teamme') // Example for postgres

// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

const Faculty = sequelize.define("Faculty", faculty)
const Project = sequelize.define("Project", project)
const Subject = sequelize.define("Subject", subject)
const User = sequelize.define("User", user)
const Team = sequelize.define("Team", team)

// USER
User.belongsTo(Faculty, { foreignKey: 'Faculty Name' })
User.belongsToMany(Team, { through: 'TeamMembers' });
// TEAM
Team.belongsToMany(User, { through: 'TeamMembers' });
Team.belongsTo(User, { foreignKey: 'Team Admin' })
Team.belongsTo(Project, { foreignKey: 'Project ID' })
// PROJECT
Project.belongsTo(Subject, { foreignKey: 'Subject Name' })
// SUBJECT
Subject.belongsTo(Faculty, { foreignKey: 'Faculty Name' })

module.exports = { sequelize, User }