import * as Yup from 'yup';
import User from '../../models/User';
import Worker from '../../models/Worker';
// -----------------------------------------------------------------------------
class UserContactListController {
  async store(req, res) {
    const schema = Yup.object().shape({
      first_name: Yup.string(),
      last_name: Yup.string(),
      worker_name: Yup.string().required(),
      phonenumber: Yup.string().required(),
      department: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Error in UserContactList Post Yup' });
    }

    const { id } = req.params;
    const {
      first_name,
      last_name,
      worker_name,
      phonenumber,
      department,
    } = req.body;

    const contact = {
      first_name,
      last_name,
      worker_name,
      phonenumber,
      department,
    };

    // console.log(contact);

    let user = await User.findByPk(id);
    let contactAlreadyExists = false;

    // worker verification
    const worker = await Worker.findOne({
      where: {
        phonenumber,
      },
    });
    if (!worker) {
      return res
        .status(400)
        .json({ error: 'Create failed: Contact is not a registered worker.' });
    }

    if (user.contact_list === null) {
      user = await user.update({
        contact_list: [contact],
      });
    } else {
      user.contact_list.map(c => {
        if (c.phonenumber === phonenumber) {
          contactAlreadyExists = true;
          return res
            .status(400)
            .json({ error: 'Create failed: Contact already exists.' });
        }
        return c;
      });

      if (contactAlreadyExists === false) {
        user.contact_list.push(contact);
      }
      user = await user.update({
        contact_list: user.contact_list,
      });
    }

    return res.json(user);
  }

  // ---------------------------------------------------------------------------
  async index(req, res) {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        canceled_at: null,
      },
    });

    return res.json(user.contact_list);
  }

  // ---------------------------------------------------------------------------
  async delete(req, res) {
    const { id } = req.params;
    const { phonenumber } = req.body;

    let user = await User.findByPk(id);
    user.contact_list.map((c, index) => {
      if (c.phonenumber === phonenumber) {
        user.contact_list.splice(index, 1);
      }
      return c;
    });
    user = await user.update({
      contact_list: user.contact_list,
    });

    return res.json(user);
  }
}

export default new UserContactListController();
