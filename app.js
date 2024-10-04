const express = require("express");
const morgan = require("morgan");
const logger = require("./logger")
const usuarios = require("./routes/usuarios")
const config = require('config');
const inicioDebug = require("debug")("app:inicio")
const dbDebug = require("debug")("app:db")


const app = express();

// Uso de middlewarers
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(logger)
app.use('/api/usuarios',usuarios)

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

//Metodos
app.get("/", (req, res) => {
  res.send("Hola mundo desde Express");
});


app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
