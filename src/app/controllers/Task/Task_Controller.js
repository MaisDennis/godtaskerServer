import { startOfHour, parseISO, isBefore, subDays } from 'date-fns';
import { Op } from 'sequelize';
import User from '../../models/User';
import Task from '../../models/Task';
import Worker from '../../models/Worker';
import File from '../../models/File';
// -----------------------------------------------------------------------------
class Task_Controller {
  async store(req, res) {
    const [
      {
        workerphonenumber,
        name,
        description,
        sub_task_list,
        task_attributes,
        start_date,
        due_date,
      },
      user_id,
    ] = req.body;

    const user = await User.findByPk(user_id);

    if (!user.phonenumber) {
      return res
        .status(400)
        .json({ error: 'Create failed: User does not exist.' });
    }

    const userphonenumber = user.phonenumber;

    const worker = await Worker.findOne({
      where: {
        phonenumber: workerphonenumber,
      },
    });

    if (!worker) {
      return res
        .status(400)
        .json({ error: 'Create failed: Worker does not exist.' });
    }

    const worker_id = worker.id;

    const hourStart = startOfHour(parseISO(start_date));
    if (isBefore(hourStart, subDays(new Date(), 1))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const task = await Task.create({
      user_id,
      userphonenumber,
      worker_id,
      workerphonenumber,
      name,
      description,
      sub_task_list,
      task_attributes,
      messages: [],
      start_date,
      due_date,
    });

    return res.json(task);
  }

  // ---------------------------------------------------------------------------
  async index(req, res) {
    const { workerNameFilter, userID } = req.query;
    const tasks = await Task.findAll({
      // order: ['due_date'],
      where: { user_id: userID },
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
      ],
    });
    return res.json(tasks);
  }

  // ---------------------------------------------------------------------------
  async update(req, res) {
    const { id } = req.params; // id: task_id

    const {
      name,
      description,
      sub_task_list,
      task_attributes,
      messages,
      score,
      start_date,
      due_date,
    } = req.body;

    let task = await Task.findByPk(id);

    task = await task.update({
      name,
      description,
      sub_task_list,
      task_attributes,
      messages,
      score,
      start_date,
      due_date,
    });

    return res.json(task);
  }

  // ---------------------------------------------------------------------------
  async delete(req, res) {
    const { id } = req.params;

    let task = await Task.findByPk(id);

    task = await task.update({
      canceled_at: new Date(),
    });

    return res.json(task);
  }
}
export default new Task_Controller();
