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
			// User_matter.belongsToMany(models.User,{through: 'Users', foreignKey: 'id'})
			// User_matter.belongsToMany(models.Matter,{through: 'Matters', foreignKey: 'id'})
		}
	}
	User_matter.init({
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		matter_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		note_1: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		note_2: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		note_3: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		sequelize,
		modelName: 'User_matter',
	});

	User_matter.removeAttribute('id');
	
	return User_matter;
};