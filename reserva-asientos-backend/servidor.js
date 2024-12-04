const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware para manejar las solicitudes JSON
app.use(bodyParser.json());

// Crear conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "reserva_asientos",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos");
});

// Ruta para obtener todos los asientos
app.get("/api/asientos", (req, res) => {
  db.query("SELECT * FROM asientos", (err, results) => {
    if (err) {
      return res.status(500).send("Error al obtener los asientos");
    }
    res.json(results);
  });
});

// Ruta para reservar un asiento
app.post("/api/asientos/reservar", (req, res) => {
  const { numero, reservadoPor } = req.body;
  db.query(
    "UPDATE asientos SET disponible = 0, reservadoPor = ? WHERE Numero = ?",
    [reservadoPor, numero],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error al reservar el asiento");
      }
      res.json({ message: "Asiento reservado correctamente" });
    }
  );
});

// Ruta para liberar un asiento
app.post("/api/asientos/liberar", (req, res) => {
  const { numero } = req.body;
  db.query(
    "UPDATE asientos SET disponible = 1, reservadoPor = NULL WHERE Numero = ?",
    [numero],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error al liberar el asiento");
      }
      res.json({ message: "Asiento liberado correctamente" });
    }
  );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
