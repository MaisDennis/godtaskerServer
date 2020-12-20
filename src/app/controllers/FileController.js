// import { profileImgUpload } from '../middlewares/profile';
import File from '../models/File';
// -----------------------------------------------------------------------------
// class FileController {
//   async store(req, res) {
//     const { originalname: name, filename: path } = req.file;
//     const file = await File.create({
//       name,
//       path,
//     });
//     return res.json(file);
//   }
// }
// export default new FileController();
class FileController {
  async index(req, res) {
    const { image } = req.query;
    const files = await File.findAll({
      where: {
        name: image,
      },
    });
    return res.json(files);
  }
}
export default new FileController();
