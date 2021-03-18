require('dotenv').config();
import Sequelize from 'sequelize';
// import mongoose from 'mongoose';
import User from '../app/models/User';
import Worker from '../app/models/Worker';
import File from '../app/models/File';
import Task from '../app/models/Task';
import Message from '../app/models/Message';
import Signature from '../app/models/Signature';
import databaseConfig from '../config/database';
// import serviceAccount from '~/config/godtasker-development-firebase-adminsdk-fro05-5617c89965.json'
import firebaseAdmin from 'firebase-admin'

const models = [User, Worker, File, Task, Message, Signature];

var serviceAccount = {
  "type": "service_account",
  "project_id": "godtasker-development",
  "private_key_id": process.env.FCM_PRIVATE_KEY_ID,
  "private_key": "",
  "client_email": "firebase-adminsdk-fro05@godtasker-development.iam.gserviceaccount.com",
  "client_id": "105553451990844460074",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fro05%40godtasker-development.iam.gserviceaccount.com"
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://godtasker-development.firebaseio.com"
});

class Database {
  constructor() {
    this.init();
    // this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // mongo() {
  //   this.mongoConnection = mongoose.connect(
  //     'mongodb://localhost:27017/gerenteDash',
  //     {
  //       useNewUrlParser: true,
  //       useFindAndModify: true,
  //       useUnifiedTopology: true,
  //     }
  //   );
  // }
}

export default new Database();
