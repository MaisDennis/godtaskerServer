module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('workers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      subscriber: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      worker_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      worker_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      birth_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_phonenumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deleted_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('workers');
  },
};
