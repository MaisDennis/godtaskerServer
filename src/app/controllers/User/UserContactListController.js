import * as Yup from 'yup';
import User from '../../models/User';
import Worker from '../../models/Worker';
// -----------------------------------------------------------------------------
class UserContactListController {
  async store(req, res) {
    // console.log(req.body)
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
      worker_id,
      first_name,
      last_name,
      worker_name,
      phonenumber,
      department,
    } = req.body;

    const contact = {
      worker_id,
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
        // .json({ error: 'Create failed: Contact is not a registered worker.' });
        .json({ error: 'Erro: O contato ainda não tem cadastro no godtasker.'})
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
            // .json({ error: 'Create failed: Contact already exists.' });
            .json({ error: 'Erro: o contato já existe.'})
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
  async update(req, res) {
    // won't need this feature. Contact Info should come from worker.
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
      worker_id,
      first_name,
      last_name,
      worker_name,
      department,
    } = req.body;
    // console.log(req.body)

    let user = await User.findByPk(id);
    let editedContactList = user.contact_list

    editedContactList.map(c => {
      if(c.worker_id === worker_id)  {
        c.first_name = first_name;
        c.last_name = last_name;
        c.worker_name = worker_name;
        c.department = department;
      }
    })
    // console.log(editedContactList)

    user = await user.update({
      contact_list: editedContactList,
    });

    return res.json(user);
  }
  // ---------------------------------------------------------------------------
  async delete(req, res) {
    const { id } = req.params;
    // const { phonenumber } = req.body;
    // console.log(id)
    // console.log(req.body)
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
