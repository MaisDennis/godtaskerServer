import Message from '../../models/Message';
import Notification from '../../schemas/Notification';
import Worker from '../../models/Worker';
// -----------------------------------------------------------------------------
class MessageMobileController {
  async store(req, res) {
    const { id } = req.params;
    const task_id = id;
    const { worker_id, user_id, message_worker } = req.body;

    const worker = await Worker.findAll({
      where: {
        id: worker_id,
      },
    });
    const worker_name = worker[0].name;

    const message = await Message.create({
      task_id,
      worker_id,
      worker_name,
      user_id,
      message_worker,
    });

    await Notification.create({
      content: `Mensagem de ${message.worker_name}.`,
      task: message.task_id,
      user: message.user_id,
      worker: message.worker_id,
      message_worker: message.message_worker,
    });

    return res.json(message);
  }

  // ---------------------------------------------------------------------------
  async index(req, res) {
    const { test } = req.query;
    const messages = await Message.findAll({
      where: {
        task_id: test,
      },
    });

    return res.json(messages);
  }
}
export default new MessageMobileController();
