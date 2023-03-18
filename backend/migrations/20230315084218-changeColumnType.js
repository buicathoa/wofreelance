'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn(
    //   'userprofiles',
    //   'is_verified_account',
    //   {
    //     type: Sequelize.BOOLEAN,
    //     allowNull: false
    //   }
    // );

    // await queryInterface.changeColumn('jobcategories', 'name', {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // })


    await queryInterface.changeColumn('jobsubcategories', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'jobcategories',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      allowNull: false,
    })
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
