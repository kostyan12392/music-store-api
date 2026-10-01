'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        title: 'Abbey Road',
        artist: 'The Beatles',
        genre: 'Rock',
        format: 'Vinyl',
        price: 3500,
        stock: 10,
        year: 1969,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Nevermind',
        artist: 'Nirvana',
        genre: 'Grunge',
        format: 'CD',
        price: 1200,
        stock: 25,
        year: 1991,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Random Access Memories',
        artist: 'Daft Punk',
        genre: 'Electronic',
        format: 'Vinyl',
        price: 4200,
        stock: 7,
        year: 2013,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};