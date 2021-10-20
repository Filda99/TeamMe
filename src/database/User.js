const {DataTypes} = require('sequelize');

module.exports = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  yearOfStudy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  communicationChannel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  properties: {
    type: DataTypes.INTEGER,
  },
}, {
  // Other model options go here
};

