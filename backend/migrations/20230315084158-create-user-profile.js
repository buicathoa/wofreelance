'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      skype_username: {
        type: Sequelize.STRING
      },
      linkedin_username: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      education: {
        type: Sequelize.STRING
      },
      birthdate: {
        type: Sequelize.DATE
      },
      role: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      describe: {
        type: Sequelize.STRING
      },
      personal_website: {
        type: Sequelize.STRING
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
      cv_uploaded: {
        type: Sequelize.STRING
      },
      other_certifications: {
        type: Sequelize.STRING
      },
      account_status: {
        type: Sequelize.STRING
      },
      latest_online_time: {
        type: Sequelize.STRING
      },
      joined: {
        type: Sequelize.STRING
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
      is_open: {
        type: Sequelize.BOOLEAN
      },
      working_time: {
        type: Sequelize.STRING
      },
      products_link: {
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
    await queryInterface.dropTable('UserProfiles');
  }
};