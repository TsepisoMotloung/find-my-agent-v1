'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [
      {
        name: 'Alice Brown',
        email: 'alice.brown@alliance.com',
        phone: '+27-11-555-0201',
        department: 'Customer Service',
        position: 'Senior Customer Service Representative',
        qr_code: `EMP-${uuidv4().substring(0, 8)}`,
        branch: 'Main Branch - Johannesburg',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Robert Wilson',
        email: 'bob.wilson@alliance.com',
        phone: '+27-21-555-0202',
        department: 'Claims Processing',
        position: 'Claims Processor',
        qr_code: `EMP-${uuidv4().substring(0, 8)}`,
        branch: 'Cape Town Branch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Carol Martinez',
        email: 'carol.martinez@alliance.com',
        phone: '+27-31-555-0203',
        department: 'Administration',
        position: 'Office Administrator',
        qr_code: `EMP-${uuidv4().substring(0, 8)}`,
        branch: 'Durban Branch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'James Taylor',
        email: 'james.taylor@alliance.com',
        phone: '+27-12-555-0204',
        department: 'Policy Services',
        position: 'Policy Specialist',
        qr_code: `EMP-${uuidv4().substring(0, 8)}`,
        branch: 'Pretoria Branch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@alliance.com',
        phone: '+27-11-555-0205',
        department: 'Customer Service',
        position: 'Customer Service Representative',
        qr_code: `EMP-${uuidv4().substring(0, 8)}`,
        branch: 'Sandton Branch',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kevin Thompson',
        email: 'kevin.thompson@alliance.com',
        phone: '+27-11-555-0206',
        department: 'Claims Processing',
        position: 'Senior Claims Adjuster',
        qr_code: `EMP-${uuidv4().substring(0, 8)}`,
        branch: 'Main Branch - Johannesburg',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('employees', employees, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  }
};