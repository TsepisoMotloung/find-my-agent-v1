"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("complaints", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      complainant_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      complainant_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      complainant_phone: {
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
        onDelete: "SET NULL",
      },
      employee_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      complaint_type: {
        type: Sequelize.ENUM("service", "billing", "claim", "policy", "other"),
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "in_progress", "resolved", "closed"),
        defaultValue: "pending",
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high", "urgent"),
        defaultValue: "medium",
      },
      resolution: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      resolved_at: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex("complaints", ["agent_id"]);
    await queryInterface.addIndex("complaints", ["employee_id"]);
    await queryInterface.addIndex("complaints", ["status"]);
    await queryInterface.addIndex("complaints", ["priority"]);
    await queryInterface.addIndex("complaints", ["complaint_type"]);
    await queryInterface.addIndex("complaints", ["created_at"]);
    await queryInterface.addIndex("complaints", ["complainant_email"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("complaints");
  },
};
