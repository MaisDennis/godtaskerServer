import * as Yup from 'yup';
// -----------------------------------------------------------------------------
import User from '../../models/User';
// -----------------------------------------------------------------------------
class UserUpdateNoPhotoController {

  async update(req, res) {
    const schema = Yup.object().shape({
      first_name: Yup.string(),
      last_name: Yup.string(),
      user_name: Yup.string(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required().min(6) : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      phonenumber: Yup.string(),
      email: Yup.string(),
      birth_date: Yup.string(),
      gender: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro nos dados' });
    }

    const { phonenumber, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

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
