const Post = require("../models/Post");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = {
  //Mostra todos os posts por ordem de criação
  async index(req, res) {
    const posts = await Post.find().sort("-createdAt");

    return res.json(posts);
  },
  //Cria Post
  async store(req, res) {
    //Recebe os dados do post
    const { author, place, description, hashtags } = req.body;
    const { filename: image } = req.file;

    //Redimensionar imagem
    const [name] = image.split(".");
    const fileName = `${name}.jpg`;

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(req.file.destination, "resized", fileName));

    //Deleta Arquivo da pasta uploads
    fs.unlinkSync(req.file.path);

    //Salva dentro do banco de dados
    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
      image: fileName
    });
    //Envia informação em tempo real
    req.io.emit("post", post);

    return res.json(post);
  }
};
