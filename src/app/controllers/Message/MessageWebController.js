import Worker from '../../models/Worker';
import Message from '../../models/Message';
import File from '../../models/File';
// -----------------------------------------------------------------------------
class MessageWebController {
  async index(req, res) {
    const { userID } = req.query;

    const messages = await Message.findAll({
      where: {
        user_id: userID,
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
export default new MessageWebController();
