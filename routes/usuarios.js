const express = require("express");
const rutas = express.Router();
const Joi = require("@hapi/joi");

const usuarios = [
    {id: 1, nombre: 'Pedro'},
    {id: 2, nombre: 'Silvi'},
    {id: 3, nombre: 'Larry'},
    {id: 4, nombre: 'Ronald'},
    {id: 5, nombre: 'Alejo'}
]

rutas.get("/", (req, res) => {
  res.send(usuarios);
});

rutas.get("/:id", (req, res) => {
  let usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) res.status(404).send("El usuario no fue encontrado");
  res.send(usuario);
});

rutas.post("/", (req, res) => {
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

rutas.put("/:id", (req, res) => {
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

rutas.delete("/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) res.status(404).send("El usuario no fue encontrado");

  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);

  res.send(usuarios);
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


module.exports = rutas