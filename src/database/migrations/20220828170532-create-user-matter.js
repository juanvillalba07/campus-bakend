'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('User_matters', {
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			matter_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Matters',
					key: 'id'
				}	
			},
			note_1: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			note_2: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			note_3: {
				allowNull: true,
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