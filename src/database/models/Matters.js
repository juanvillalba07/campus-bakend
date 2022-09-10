'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Matter extends Model {
		static associate(models) {
			Matter.belongsToMany(models.User, { through: 'User_matters', foreignKey: 'matter_id' });
		}
	}
	Matter.init({
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			validate: {
				len: {
					args: [3, 50],
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