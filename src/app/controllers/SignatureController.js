import Signature from '../models/Signature';
// -----------------------------------------------------------------------------
class SignatureController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const signature = await Signature.create({
      name,
      path,
    });
    // *************************************************************************
    // eslint-disable-next-line no-console
    console.log(signature);
    return res.json(signature);
  }

  // ---------------------------------------------------------------------------
  async index(req, res) {
    const { image } = req.query;
    const signatures = await Signature.findOne({
      where: {
        name: image,
      },
    });
    return res.json(signatures);
  }
}
export default new SignatureController();
