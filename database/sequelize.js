const { Sequelize } = require('sequelize');
const user = require("./User")

// Option 1: Passing a connection URI
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/dbname') // Example for postgres

// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

const User = sequelize.define("User", user)


module.exports = { sequelize, User }