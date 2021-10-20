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
  briefDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  properties: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxNumberOfMembers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hashtags: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Other model options go here
};

