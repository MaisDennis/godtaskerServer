import Worker from '../../models/Worker';
import Message from '../../models/Message';
import File from '../../models/File';
// -----------------------------------------------------------------------------
class MessageWebPerTaskController {
  async index(req, res) {
    const { taskID } = req.query;

    const messages = await Message.findAll({
      where: {
        task_id: taskID,
      },
      include: [
        {
          model: Worker,
          as: 'worker',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(messages);
  }
}
export default new MessageWebPerTaskController();
