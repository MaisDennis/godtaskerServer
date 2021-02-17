import * as Yup from 'yup';
import User from '../../models/User';
import Worker from '../../models/Worker';
// -----------------------------------------------------------------------------
class UserContactListRemoveController {
  async update(req, res) {

    // const schema = Yup.object().shape({
    //   first_name: Yup.string(),
    //   last_name: Yup.string(),
    //   worker_name: Yup.string().required(),
    //   phonenumber: Yup.string().required(),
    //   department: Yup.string(),
    // });

    // if (!(await schema.isValid(req.body))) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Error in UserContactList Post Yup' });
    // }

    const { id } = req.params;
    const { phonenumber } = req.body;
    // console.log(id)

    let user = await User.findByPk(id);
    let editedContactList = user.contact_list
    editedContactList.map((c, index) => {
      if (c.phonenumber === phonenumber) {
        editedContactList.splice(index, 1);
      }
      return c;
    });
    // console.log(editedContactList)
    user = await user.update({
      contact_list: editedContactList,
    });

    return res.json(user);
  }
}

export default new UserContactListRemoveController();
