'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BidAwards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bidding_id: {
        type: Sequelize.INTEGER
      },
      bidding_amount: {
        type: Sequelize.INTEGER
      },
      hourly_rate: {
        type: Sequelize.INTEGER
      },
      weekly_limit: {
        type: Sequelize.INTEGER
      },
      delivered_time: {
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
    await queryInterface.dropTable('BidAwards');
  }
};