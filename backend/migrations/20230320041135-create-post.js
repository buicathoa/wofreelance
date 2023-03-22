'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      project_detail: {
        type: Sequelize.STRING
      },
      skills: {
        type: Sequelize.STRING
      },
      project_paid_unit: {
        type: Sequelize.STRING
      },
      project_budget: {
        type: Sequelize.INTEGER
      },
      avg_bid_unit: {
        type: Sequelize.FLOAT
      },
      bidding_time_start: {
        type: Sequelize.DATE
      },
      bidding_time_end: {
        type: Sequelize.DATE
      },
      project_paid_type: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Posts');
  }
};