const express = require("express");
const morgan = require("morgan");
const Joi = require("@hapi/joi");
const logger = require("./logger")
const config = require('config');
const inicioDebug = require("debug")("app:inicio")
const dbDebug = require("debug")("app:db")


const app = express();

// Uso de middlewarers
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(logger)

// Entornos
if(app.get('env') === "development"){
  app.use(morgan('tiny'))
  console.log("Aplicación: "+ config.get('nombre'))
  console.log("BD Server: "+ config.get('configDB.host'))
  inicioDebug("Morgan está habilitado")
}

// Debug
dbDebug("Conectando con la DB...")

// Variables de entorno
const port = process.env.PORT || 3000;
const usuarios = [
  {
    id: 1,
    nombre: "Pedro",
  },
  {
    id: 2,
    nombre: "Arturo",
  },
  {
    id: 3,
    nombre: "Higuera",
  },
  {
    id: 4,
    nombre: "Garzón",
  },
];

//Metodos
app.get("/", (req, res) => {
  res.send("Hola mundo desde Express");
});

app.get("/api/usuarios", (req, res) => {
  res.send(usuarios);
});

app.get("/api/usuarios/:id", (req, res) => {
  let usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) res.status(404).send("El usuario no fue encontrado");
  res.send(usuario);
});

app.post("/api/usuarios", (req, res) => {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });

  const { error, value } = schema.validate({
    nombre: req.body.nombre,
  });

  if (!error) {
    const usuario = {
      id: usuarios.length + 1,
      nombre: req.body.nombre,
    };
    usuarios.push(usuario);
    res.send(usuario);
  } else {
    const msg = error.details[0].message;
    res.status(400).send(msg);
  }
});

app.put("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) res.status(404).send("El usuario no fue encontrado");

  const { error, value } = validarUsuario(req.body.nombre);

  if (!error) {
    usuario.nombre = value.nombre;
    res.send(usuario);
  } else {
    const msg = error.details[0].message;
    res.status(400).send(msg);
  }
});

app.delete("/api/usuarios/:id", (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send("El usuario no fue encontrado");

    const index = usuarios.indexOf(usuario)
    usuarios.splice(index,1)

    res.send(usuarios)
});

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});

function existeUsuario(id) {
  return usuarios.find((u) => u.id === parseInt(id));
}

function validarUsuario(nombre) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });

  return schema.validate({
    nombre: nombre,
  });
}
