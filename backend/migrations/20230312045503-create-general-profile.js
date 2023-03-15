'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GeneralProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        isEmail: true
      },
      referer_code: {
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
    await queryInterface.dropTable('GeneralProfiles');
  }
};