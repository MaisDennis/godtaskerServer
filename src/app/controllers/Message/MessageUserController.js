import Message from '../../models/Message';
import Task from '../../models/Task';
import Worker from '../../models/Worker';
import firebaseAdmin from 'firebase-admin'

class MessageUserController {

  async update(req, res) {
    const { id } = req.params;
    const { messages, task_id, user_name } = req.body;
    console.log('MessageWorkerController')

    let message = await Message.findByPk(id);

    message.messages.push(messages)

    message = await message.update({
      messages: message.messages,
    });

    // Firebase Notification ***************************************************

    const task = await Task.findByPk(task_id)
    const worker = await Worker.findByPk(message.worker_id)

    const pushMessage = {
      notification: {
        title: `Message from ${user_name}`,
        body: `Task: ${task.name} Message: ${messages.message}`
      },
      data: {

      },
      android: {
        notification: {
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      },
      token: worker.notification_token
    };

    firebaseAdmin.messaging().send(pushMessage)
      .then(response => {
        console.log('User sent message: ', response);
      })
      .catch(error => {
        console.log('Error sending message: ', error);
      })

    return res.json(message);
  }
}
export default new MessageUserController();
