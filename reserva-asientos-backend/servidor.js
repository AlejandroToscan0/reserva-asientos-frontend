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
  user: "admin",
  password: "admin",
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

// Ruta para reservar un asiento por número
app.post("/api/asientos/reservar/:numero", (req, res) => {
  const { numero } = req.params; // Número del asiento de la URL
  const { reservadoPor } = req.body; // Nombre del usuario desde el body

  db.query(
    "UPDATE asientos SET disponible = 0, reservadoPor = ? WHERE Numero = ?",
    [reservadoPor, numero],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error al reservar el asiento");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("El asiento no existe o ya está reservado");
      }
      res.json({ message: "Asiento reservado correctamente" });
    }
  );
});


// Ruta para liberar un asiento por número
app.post("/api/asientos/liberar/:numero", (req, res) => {
  const { numero } = req.params;  // Usar el parámetro de la URL

  db.query(
    "UPDATE asientos SET disponible = 1, reservadoPor = NULL WHERE Numero = ?",
    [numero],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error al liberar el asiento");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("El asiento no existe o no está reservado");
      }
      res.json({ message: "Asiento liberado correctamente" });
    }
  );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
