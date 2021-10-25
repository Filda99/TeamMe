const { DataTypes } = require('sequelize');

module.exports = {
    short: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}

