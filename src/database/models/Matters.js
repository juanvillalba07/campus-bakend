'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Matter extends Model {
    static associate(models) {
    }
  }
  Matter.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isAlpha: { msg:"El nombre solo debe contener letras" },
        len: {
          args: [3,50],
          msg: "El nombre debe contener entre 3 a 50 letras"
        }
      },
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    registered: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Matter',
  });
  return Matter;
};