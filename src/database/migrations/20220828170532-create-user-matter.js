'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('User_matters', {
			user_id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			matter_id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.INTEGER	
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('User_matters');
	}
};