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
  workingHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  workingDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  approach: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  partOfSemester: {
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
  },
  visible: {
    type: DataTypes.INTEGER, // 1 - visible, 2 - unvisible (in list of teams)
    defaultValue: 1,
    allowNull: false,
  }
}, {
  // Other model options go here
};

/** Properties
 * workingHours - daily 
 * workingDays - in week ( workday / weekend)
 * approach (individual / team)
 * 
 ** More:
 * partOfSemester (1, 2, 3, 4) - each is 3 weeks
 */

