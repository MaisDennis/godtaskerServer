import { Op } from 'sequelize';
import Task from '../../models/Task';
import Worker from '../../models/Worker';
import File from '../../models/File';
import User from '../../models/User';
// -----------------------------------------------------------------------------
class TaskFinishedByWorkerController {
  async index(req, res) {
    const { test } = req.query;
    const tasks = await Task.findAll({
      where: { end_date: { [Op.ne]: null } },
      order: ['end_date'],
      include: [
        {
          model: Worker,
          as: 'worker',
          attributes: ['id', 'name'],
          where: {
            name: {
              [Op.like]: `%${test}%`,
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
        },
      ],
    });
    return res.json(tasks);
  }
}

export default new TaskFinishedByWorkerController();
