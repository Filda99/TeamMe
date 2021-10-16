const { DataTypes } = require('sequelize');

module.exports = {
    shortcut: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    // Other model options go here
};

