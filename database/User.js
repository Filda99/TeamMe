const {DataTypes, Sequelize} = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  login: {
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
  workingHours: {
    type: DataTypes.INTEGER,
  },
  workingDays: {
    type: DataTypes.INTEGER,
  },
  approach: {
    type: DataTypes.INTEGER,
  },
  verification: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: true,
  },
}, {
  // Other model options go here
};

