import * as Yup from 'yup';
// -----------------------------------------------------------------------------
import User from '../../models/User';
import File from '../../models/File';
// -----------------------------------------------------------------------------
class UserUpdateNoPhotoController {

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

    const { id, user_name } = await User.findByPk(req.userId)

    return res.json({ id, phonenumber, user_name });
  }
}
export default new UserUpdateNoPhotoController();
