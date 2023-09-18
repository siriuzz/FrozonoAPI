'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventories', {
      id: {
        field: 'id',
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false

      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false

      },
      date: {
        type: Sequelize.DATE,
        allowNull: false

      },
      flavor: {
        type: Sequelize.STRING,
        allowNull: false

      },
      is_season_flavor: {
        type: Sequelize.BOOLEAN,
        allowNull: false

      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false

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
    await queryInterface.dropTable('Inventories');
  }
};