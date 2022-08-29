'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert('Users', [{
			name: 'admin',
			password: '$2a$10$61WkhmWRISXATP5bZOBhseeKiLfoVWYC/0Tf1dzzpqNHyl3ovrBmW',
			email: 'admin@gmail.com',
			dni: '11111111',
			role: 'admin',
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			name: 'student',
			password: '$2a$10$61WkhmWRISXATP5bZOBhseeKiLfoVWYC/0Tf1dzzpqNHyl3ovrBmW',
			email: 'student@gmail.com',
			dni: '22222222',
			role: 'student',
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			name: 'teacher',
			password: '$2a$10$61WkhmWRISXATP5bZOBhseeKiLfoVWYC/0Tf1dzzpqNHyl3ovrBmW',
			email: 'teacher@gmail.com',
			dni: '33333333',
			role: 'teacher',
			createdAt: new Date(),
			updatedAt: new Date()
		}], {});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
