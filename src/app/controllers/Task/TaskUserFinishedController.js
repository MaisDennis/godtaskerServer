import { Op } from 'sequelize';
import Task from '../../models/Task';
import Worker from '../../models/Worker';
import File from '../../models/File';
import User from '../../models/User';
import Signature from '../../models/Signature';
// -----------------------------------------------------------------------------
class TaskUserUnfinishedController {
  async index(req, res) {
    const { workerNameFilter, userID } = req.query;
    const tasks = await Task.findAll({
      order: ['due_date'],
      where: { user_id: userID, canceled_at: null, end_date: { [Op.ne]: null } },
      include: [
        {
          model: Worker,
          as: 'worker',
          attributes: ['id', 'worker_name', 'phonenumber'],
          where: {
            worker_name: {
              [Op.like]: `%${workerNameFilter}%`,
            },
          },
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'user_name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: Signature,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(tasks);
  }
}

export default new TaskUserUnfinishedController();
