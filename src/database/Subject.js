const { DataTypes } = require('sequelize');

module.exports = {
    shortcut: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }
}, {
    // Other model options go here
};

