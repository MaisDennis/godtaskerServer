import Sequelize, { Model } from 'sequelize';

class Message extends Model {
  static init(sequelize) {
    super.init(
      {
        user_name: Sequelize.STRING,
        worker_name: Sequelize.STRING,
        messages: Sequelize.JSON,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Task, { foreignKey: 'task_id', as: 'task' });
    this.belongsTo(models.Worker, { foreignKey: 'worker_id', as: 'worker' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}
export default Message;
