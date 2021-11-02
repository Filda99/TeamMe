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
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}

