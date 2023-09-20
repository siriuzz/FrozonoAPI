'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventories', {
      id: {
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Inventories');
  }
};