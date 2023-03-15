'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ServiceProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      areas_of_expertise: {
        type: Sequelize.STRING
      },
      yoe: {
        type: Sequelize.INTEGER
      },
      majority: {
        type: Sequelize.STRING
      },
      service_role: {
        type: Sequelize.STRING
      },
      list_service: {
        type: Sequelize.STRING
      },
      is_receive_service: {
        type: Sequelize.BOOLEAN
      },
      working_time: {
        type: Sequelize.STRING
      },
      products_link: {
        type: Sequelize.STRING
      },
      latest_online_time: {
        type: Sequelize.DATE
      },
      joined: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('ServiceProfiles');
  }
};