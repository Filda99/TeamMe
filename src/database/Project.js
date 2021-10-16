const { DataTypes } = require('sequelize');

module.exports = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    // Other model options go here
};

