const { DataTypes } = require('sequelize');

module.exports = {
    short: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }
}

