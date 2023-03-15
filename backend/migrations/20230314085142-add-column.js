'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('serviceprofiles', 'user_id', {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: 'generalprofiles',
    //     key: 'id'
    //   }
    // });

    await queryInterface.changeColumn('serviceprofiles', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'generalprofiles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // await queryInterface.removeColumn('serviceprofiles', 'user_id');
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
