'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Matters', [{
			name: 'Matematica',
			quota: 30,
			registered: 20,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			name: 'Programacion',
			quota: 30,
			registered: 30,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			name: 'Ingenieria de software',
			quota: 30,
			registered: 17,
			createdAt: new Date(),
			updatedAt: new Date()
		},
    {
      name: 'Arquitectura de computadoras',
			quota: 30,
			registered: 24,
			createdAt: new Date(),
			updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    
  }
};
