'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Form extends Model {
		static associate(models) {
		}
	}
	Form.init({
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: "Email requerido" },
				isEmail: { msg: "Formato de email invalido" },
				len: {
					args: [5, 100],
					msg: "El correo puede contener hasta 100 caracteres maximo"
				}
			}
		},
		affair: {
			type: DataTypes.STRING,
			allowNull: false
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'Form',
	});
	return Form;
};