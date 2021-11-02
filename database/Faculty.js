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
        type: DataTypes.STRING,
        allowNull: false,
    }
}

