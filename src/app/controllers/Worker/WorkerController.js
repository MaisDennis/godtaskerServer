import * as Yup from 'yup';
import { Op } from 'sequelize';
// -----------------------------------------------------------------------------
import Worker from '../../models/Worker';
import File from '../../models/File';
// -----------------------------------------------------------------------------
class WorkerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      first_name: Yup.string().required(),
      last_name: Yup.string().required(),
      worker_name: Yup.string().required(),
      worker_password: Yup.string()
        .required()
        .min(1),
      phonenumber: Yup.string()
        .required()
        .min(11),
      email: Yup.string()
        .email()
        .required(),
      birth_date: Yup.string(),
      gender: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Worker Create fail: schema error' });
    }

    const workerExists = await Worker.findOne({
      where: { phonenumber: req.body.phonenumber },
    });
    if (workerExists) {
      return res
        .status(400)
        .json({ error: 'Worker Create fail: Phonenumber already exists.' });
    }

    const {
      id,
      subscriber,
      first_name,
      last_name,
      worker_name,
      worker_password,
      phonenumber,
      email,
      birth_date,
      gender,
    } = req.body;

    const worker = await Worker.create({
      id,
      subscriber,
      first_name,
      last_name,
      worker_name,
      worker_password,
      phonenumber,
      email,
      birth_date,
      gender,
    });
    return res.json(worker);
  }

  // ---------------------------------------------------------------------------
  async update(req, res) {
    let worker = await Worker.findOne({
      where: {
        phonenumber: req.body.phonenumber,
      },
    });

    worker = await worker.update(req.body);

    return res.json(worker);
  }

  // ---------------------------------------------------------------------------
  async index(req, res) {
    const { nameFilter } = req.query;
    const workers = await Worker.findAll({
      attributes: [
        'id',
        'subscriber',
        'first_name',
        'last_name',
        'worker_name',
        'worker_password',
        'phonenumber',
        'email',
        'birth_date',
        'gender',
      ],
      where: {
        worker_name: {
          [Op.like]: `%${nameFilter}%`,
        },
        canceled_at: null,
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(workers);
  }

  //----------------------------------------------------------------------------
  async delete(req, res) {
    let worker = await Worker.findOne({
      where: {
        phonenumber: req.body.phonenumber,
      },
    });

    const workerCanceledPhonenumber = worker.phonenumber;
    const workerCanceledEmail = worker.email;

    worker = await worker.update({
      phonenumber: '',
      deleted_phonenumber: workerCanceledPhonenumber,
      deleted_email: workerCanceledEmail,
      canceled_at: new Date(),
    });

    return res.json(worker);
  }
}

export default new WorkerController();
