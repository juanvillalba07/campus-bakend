'use strict';
const { Model } = require('sequelize');
const Matter = require('./Matters');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.belongsToMany(models.Matter,{through: 'User_matters', foreignKey: 'user_id'});
		}
	}
	User.init({
		name: {
			type: DataTypes.STRING(50),
			allowNull: true,
			validate: {
				isAlpha: { msg: "El nombre solo debe contener letras" },
				len: {
					args: [3, 50],
					msg: "El nombre debe contener entre 3 a 50 letras"
				}
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				notNull: { msg: "Email requerido" },
				isEmail: { msg: "Formato de email invalido" },
				len: {
					args: [5, 100],
					msg: "El correo puede contener hasta 100 caracteres maximo"
				}
			}
		},
		dni: {
			type: DataTypes.STRING(8),
			allowNull: false,
			unique: true,
			validate: {
				notNull: { msg: "DNI requerido" },
				len: {
					args: [7, 8],
					msg: "DNI invalido"
				}
			}
		},
		role: {
			type: DataTypes.ENUM('student', 'admin', 'teacher'),
			allowNull: false,
			defaultValue: "student"
		}
	}, {
		sequelize,
		modelName: 'User',
	});
	return User;
};