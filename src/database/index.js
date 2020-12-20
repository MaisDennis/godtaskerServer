import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import Worker from '../app/models/Worker';
import File from '../app/models/File';
import Task from '../app/models/Task';
import Message from '../app/models/Message';
import Signature from '../app/models/Signature';
import databaseConfig from '../config/database';

const models = [User, Worker, File, Task, Message, Signature];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gerenteDash',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
