"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ratings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      rater_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rater_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rater_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      policy_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      agent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "agents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      employee_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      question_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rating_value: {
        type: Sequelize.TINYINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });

    // Add indexes
    await queryInterface.addIndex("ratings", ["agent_id"]);
    await queryInterface.addIndex("ratings", ["employee_id"]);
    await queryInterface.addIndex("ratings", ["question_id"]);
    await queryInterface.addIndex("ratings", ["rating_value"]);
    await queryInterface.addIndex("ratings", ["created_at"]);
    await queryInterface.addIndex("ratings", ["rater_email"]);

    // Note: We'll handle the constraint logic in the application layer instead of database constraint
    // This avoids the MySQL foreign key constraint conflict
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ratings");
  },
};
