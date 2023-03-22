'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.changeColumn("subcateandskills", "skillset_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "jobskillsets",
        key: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });

    await queryInterface.changeColumn("subcateandskills", "subcategory_id", {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      references: {
        model: "jobsubcategories",
        key: "id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });

    // await queryInterface.addConstraint('skillsetandposts', {
    //   fields: ['post_id', 'skillset_id'],
    //   type: 'unique',
    //   name: 'post_skillset_uniques'
    // });

    // await queryInterface.changeColumn('subchildcategories', 'category_id', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'jobcategories',
    //     key: 'id',
    //     onDelete: 'CASCADE',
    //     onUpdate: 'CASCADE'
    //   }
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
