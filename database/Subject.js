const { DataTypes } = require('sequelize');

module.exports = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    short: {
        allowNull: false,
        type: DataTypes.STRING
    },
    year: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    specialization: {
        allowNull: false,
        type: DataTypes.STRING
    },
    compulsory: {   // compulsory - 1(povinny), 2(povinne volitelny), 3(nepovinny)
        allowNull: false,
        type: DataTypes.INTEGER
    }
}

