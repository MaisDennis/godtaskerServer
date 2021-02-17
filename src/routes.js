import { Router } from 'express';
import multer from 'multer';
// -----------------------------------------------------------------------------
// import MessageMobileController from './app/controllers/Message/MessageMobileController';
// import MessageWebController from './app/controllers/Message/MessageWebController';
// import MessageWebPerTaskController from './app/controllers/Message/MessageWebPerTaskController';
import MessageController from './app/controllers/Message/MessageController';
import MessageRemoveController from './app/controllers/Message/MessageRemoveController';

import NotificationController from './app/controllers/NotificationController';

import SessionController from './app/controllers/SessionController';
import SignatureController from './app/controllers/SignatureController';

import TaskConfirmController from './app/controllers/Task/TaskConfirmController';
import TaskController from './app/controllers/Task/Task_Controller';
import TaskDetailController from './app/controllers/Task/TaskDetailController';

import TaskWorkerFinishedController from './app/controllers/Task/TaskWorkerFinishedController';
import TaskWorkerUnfinishedController from './app/controllers/Task/TaskWorkerUnfinishedController';
import TaskWorkerCanceledController from './app/controllers/Task/TaskWorkerCanceledController';

import TaskMessageController from './app/controllers/Task/TaskMessageController';

import TaskUserUnfinishedController from './app/controllers/Task/TaskUserUnfinishedController';
import TaskUserFinishedController from './app/controllers/Task/TaskUserFinishedController';
import TaskUserCanceledController from './app/controllers/Task/TaskUserCanceledController';

import UserController from './app/controllers/User/UserController';
import UserContactListController from './app/controllers/User/UserContactListController';
import UserContactListRemoveController from './app/controllers/User/UserContactListRemoveController';
import UserUpdateNoPhotoController from './app/controllers/User/UserUpdateNoPhotoController';

import WorkerMobileController from './app/controllers/Worker/WorkerMobileController';
import WorkerController from './app/controllers/Worker/WorkerController';
import WorkerUpdateNoPhotoController from './app/controllers/Worker/WorkerUpdateNoPhotoController';
import WorkerIndividualController from './app/controllers/Worker/WorkerIndividualController';

import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import File from './app/models/File';
import Signature from './app/models/Signature';
import profileImgUpload from './app/middlewares/profile';
import signatureImgUpload from './app/middlewares/signature';

// -----------------------------------------------------------------------------
const routes = new Router();
// const upload = multer(multerConfig);
// routes.get('/messages/web', MessageWebController.index);
// routes.get('/messages/web/task', MessageWebPerTaskController.index);
// routes.post('/messages/mobile/:id', MessageMobileController.store);
routes.post('/messages', MessageController.store);
routes.put('/messages/:id', MessageController.update);
routes.get('/messages/:id', MessageController.index);
routes.delete('/messages/:id', MessageController.delete);
routes.put('/messages/remove/:id', MessageRemoveController.update);

routes.post('/sessions', SessionController.store);

routes.get('/tasks', TaskController.index);
routes.delete('/tasks/:id', TaskController.delete);
routes.put('/tasks/messages/:id', TaskMessageController.update);

routes.get('/tasks/finished', TaskWorkerFinishedController.index);
routes.get('/tasks/unfinished', TaskWorkerUnfinishedController.index);
routes.get('/tasks/canceled', TaskWorkerCanceledController.index);
routes.put('/tasks/confirm/:id', TaskConfirmController.update);

routes.post('/users', UserController.store);

routes.get('/workers', WorkerController.index);
routes.post('/workers', WorkerController.store);
routes.put('/workers', WorkerController.update);
routes.put('/workers/no-photo', WorkerUpdateNoPhotoController.update);
routes.get('/workers/mobile', WorkerMobileController.index);
routes.get('/workers/individual', WorkerIndividualController.index);


// routes.get('/messages/tfeed', TaskFeedMobileController.index);
// routes.put('/tasks/:id/tfeed/comment', T_FeedController.update);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.get('/signatures', SignatureController.index);
routes.get('/files', FileController.index);

// routes.post(
//   '/signatures',
//   upload.single('signature'),
//   SignatureController.store
// );
routes.post('/signatures', (req, res) => {
  signatureImgUpload(req, res, async error => {
    // console.log(req);
    // console.log('requestOkokok', req.file);
    // console.log('error', error);
    if (error) {
      // console.log('errors', error);
      res.json({ error });
    } else {
      // If File not found
      if (req.file === undefined) {
        // console.log('Error: No File Selected!');
        res.json('Error: No File Selected');
      }
      // If Success
      const name = req.file.key;
      const path = req.file.location;
      await Signature.create({
        name,
        path,
      });
      const signature = await Signature.findOne({
        where: {
          name,
        },
      });
      // Save the file name into database into profile model
      res.json({
        image: name,
        location: path,
        signature_id: signature.id,
      });
    }
  });
}); // End of single profile upload

// routes.post('/files', upload.single('file'), FileController.store);
routes.post('/files', (req, res) => {
  profileImgUpload(req, res, error => {
    // console.log(req);
    // console.log('requestOkokok', req.file);
    // console.log('error', error);
    if (error) {
      // console.log('errors', error);
      res.json({ error });
    } else {
      // If File not found
      if (req.file === undefined) {
        // console.log('Error: No File Selected!');
        res.json('Error: No File Selected');
      }
      // If Success
      const imageName = req.file.key;
      const imageLocation = req.file.location;
      File.create({
        name: imageName,
        path: imageLocation,
      });
      // Save the file name into database into profile model
      res.json({
        image: imageName,
        location: imageLocation,
      });
    }
  });
}); // End of single profile upload

// -----------------------------------------------------------------------------
routes.use(authMiddleware);
// -----------------------------------------------------------------------------

routes.post('/tasks', TaskController.store);
routes.put('/tasks/:id', TaskController.update);
routes.get('/tasks/:id/details', TaskDetailController.index);
routes.put('/tasks/:id/details', TaskDetailController.update);

routes.get('/tasks/user/canceled', TaskUserCanceledController.index);
routes.get('/tasks/user/unfinished', TaskUserUnfinishedController.index);
routes.get('/tasks/user/finished', TaskUserFinishedController.index);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);
routes.delete('/users', UserController.delete);
routes.put('/users/no-photo', UserUpdateNoPhotoController.update);

routes.post('/users/:id/contact-list', UserContactListController.store);
routes.get('/users/:id/contact-list', UserContactListController.index);
routes.put('/users/:id/contact-list', UserContactListController.update);
routes.delete('/users/:id/contact-list', UserContactListController.delete);
routes.put('/users/:id/remove-contact', UserContactListRemoveController.update);

routes.delete('/workers', WorkerController.delete);

export default routes;
