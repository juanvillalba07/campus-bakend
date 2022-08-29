'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_matter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_matter.init({
    user_id: DataTypes.INTEGER,
    matter_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_matter',
  });
  return User_matter;
};