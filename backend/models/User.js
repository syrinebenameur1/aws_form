const { DataTypes } = require('sequelize'),
      sequelize      = require('../db');

const User = sequelize.define('User', {
  email:    { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  age:      { type: DataTypes.INTEGER, allowNull: false },
  fileKey:  { type: DataTypes.STRING }
});

module.exports = User;