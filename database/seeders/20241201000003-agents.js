'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const agents = [
      {
        name: 'John Smith',
        email: 'john.smith@alliance.com',
        phone: '+27-11-555-0101',
        location: 'Johannesburg CBD',
        latitude: -26.2041,
        longitude: 28.0473,
        is_online: true,
        qr_code: `AGT-${uuidv4().substring(0, 8)}`,
        branch: 'Main Branch - Johannesburg',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@alliance.com',
        phone: '+27-21-555-0102',
        location: 'Cape Town Waterfront',
        latitude: -33.9249,
        longitude: 18.4241,
        is_online: true,
        qr_code: `AGT-${uuidv4().substring(0, 8)}`,
        branch: 'Cape Town Branch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Michael Davis',
        email: 'mike.davis@alliance.com',
        phone: '+27-31-555-0103',
        location: 'Durban Central',
        latitude: -29.8587,
        longitude: 31.0218,
        is_online: false,
        qr_code: `AGT-${uuidv4().substring(0, 8)}`,
        branch: 'Durban Branch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@alliance.com',
        phone: '+27-12-555-0104',
        location: 'Pretoria CBD',
        latitude: -25.7479,
        longitude: 28.2293,
        is_online: true,
        qr_code: `AGT-${uuidv4().substring(0, 8)}`,
        branch: 'Pretoria Branch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'David Chen',
        email: 'david.chen@alliance.com',
        phone: '+27-11-555-0105',
        location: 'Sandton City',
        latitude: -26.1076,
        longitude: 28.0567,
        is_online: true,
        qr_code: `AGT-${uuidv4().substring(0, 8)}`,
        branch: 'Sandton Branch',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('agents', agents, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('agents', null, {});
  }
};