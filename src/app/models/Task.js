import Sequelize, { Model } from 'sequelize';

class Task extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING(1234),
        score: Sequelize.INTEGER,
        sub_task_list: Sequelize.JSON,
        task_attributes: Sequelize.JSON,
        messages: Sequelize.JSON,
        start_date: Sequelize.DATE,
        due_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, {
      foreignKey: 'userphonenumber',
    });
    this.belongsTo(models.Worker, { foreignKey: 'worker_id', as: 'worker' });
    this.belongsTo(models.Worker, {
      foreignKey: 'workerphonenumber',
    });
    this.belongsTo(models.Signature, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}
export default Task;
