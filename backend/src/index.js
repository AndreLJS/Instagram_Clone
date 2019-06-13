const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

//Permite protocolo http e socket.io
const server = require("http").Server(app);
const io = require("socket.io")(server);

//Conexão com Banco de Dados
mongoose.connect("mongodb://user:E221308a@ds237267.mlab.com:37267/instaclone", {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(cors()); //Permite que todas as URLs possam acessar esse backend

//Guardar Arquivos estáticos
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "uploads", "resized"))
);
app.use(require("./routes"));

server.listen(3000);
