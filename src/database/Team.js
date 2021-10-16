const { DataTypes } = require('sequelize');

module.exports = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brief_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  properties: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_number_of_members: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  // Other model options go here
};

