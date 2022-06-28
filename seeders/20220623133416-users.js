module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', 
    [
      {
        name: 'Admin',
        email: 'Admin',
        password: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('user', null, {}),
};