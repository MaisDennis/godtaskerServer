import * as Yup from 'yup';
// -----------------------------------------------------------------------------
import User from '../../models/User';
import File from '../../models/File';
// -----------------------------------------------------------------------------
class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      first_name: Yup.string().required(),
      last_name: Yup.string().required(),
      user_name: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
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
      return res.status(400).json({ error: 'Create User fail: Schema error' });
    }

    let userExists = await User.findOne({
      where: {
        phonenumber: req.body.phonenumber,
      },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'User Create fail: Phonenumber already exists.' });
    }

    userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'User Create fail: e-mail already exists.' });
    }

    const {
      id,
      subscriber,
      first_name,
      last_name,
      user_name,
      phonenumber,
      email,
      birth_date,
      gender,
    } = await User.create(req.body);

    return res.json({
      id,
      subscriber,
      first_name,
      last_name,
      user_name,
      phonenumber,
      email,
      birth_date,
      gender,
    });
  }

  // ---------------------------------------------------------------------------
  async update(req, res) {
    const schema = Yup.object().shape({
      first_name: Yup.string(),
      last_name: Yup.string(),
      user_name: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      phonenumber: Yup.string(),
      // email: Yup.string().email(),
      birth_date: Yup.string(),
      gender: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro nos dados' });
    }

    // console.log(req.body)
    const { phonenumber, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);
    // %%%%%%%%%%%%%%%%%%%%%%%%%
    // console.log(req.userId);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(401)
        .json({ error: 'Erro: A senha atual não confere.' });
    }

    await user.update(req.body);

    const { id, user_name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json({ id, user_name, phonenumber, avatar });
  }

  // ---------------------------------------------------------------------------
  async index(req, res) {
    const users = await User.findAll({
      where: {
        canceled_at: null,
      },
    });

    return res.json(users);
  }

  // ---------------------------------------------------------------------------
  async delete(req, res) {
    let user = await User.findByPk(req.userId);

    const userCanceledPhonenumber = user.phonenumber;
    const userCanceledEmail = user.email;

    user = await user.update({
      phonenumber: '',
      email: '',
      canceled_at: new Date(),
      deleted_phonenumber: userCanceledPhonenumber,
      deleted_email: userCanceledEmail,
    });

    return res.json(user);
  }
}

export default new UserController();
