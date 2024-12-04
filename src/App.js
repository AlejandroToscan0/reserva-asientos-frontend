import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";  // Importa el archivo CSS que acabamos de crear

const App = () => {
  const [asientos, setAsientos] = useState([]); // Estado inicial vacío para los asientos

  // Obtener los asientos desde el backend
  useEffect(() => {
    const fetchAsientos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/asientos");
        setAsientos(response.data); // Guardar los datos obtenidos en el estado
      } catch (error) {
        console.error("Error al obtener los asientos:", error.message);
        alert("No se pudieron cargar los asientos.");
      }
    };

    fetchAsientos(); // Llamar a la función al montar el componente
  }, []);

  // Reservar un asiento
  const reservarAsiento = async (numero) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/asientos/reservar/${numero}`, {
        reservadoPor: "Usuario",
      });
      alert(response.data.message); // Mostrar mensaje del backend
      setAsientos((prev) =>
        prev.map((asiento) =>
          asiento.Numero === numero
            ? { ...asiento, Disponible: 0, reservadoPor: "Usuario" }
            : asiento
        )
      );
    } catch (error) {
      console.error("Error al reservar el asiento:", error.message);
      alert("El asiento no pudo ser reservado.");
    }
  };

  // Liberar un asiento
  const liberarAsiento = async (numero) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/asientos/liberar/${numero}`);
      alert(response.data.message); // Mostrar mensaje del backend
      setAsientos((prev) =>
        prev.map((asiento) =>
          asiento.Numero === numero
            ? { ...asiento, Disponible: 1, reservadoPor: null }
            : asiento
        )
      );
    } catch (error) {
      console.error("Error al liberar el asiento:", error.message);
      alert("El asiento no pudo ser liberado.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Reserva de Asientos</h1>
      <div className="row">
        {asientos.map((asiento) => (
          <div key={asiento.Numero} className="col-md-3 col-sm-6 mb-3">
            <button
              className={`btn-asiento ${asiento.Disponible ? "disponible" : "ocupado"}`}
              onClick={() =>
                asiento.Disponible
                  ? reservarAsiento(asiento.Numero)
                  : liberarAsiento(asiento.Numero)
              }
            >
              <h5>
                {asiento.Disponible ? (
                  `Asiento ${asiento.Numero} Disponible`
                ) : (
                  <>
                    Reservado <br />
                    <small>{asiento.reservadoPor || "Sin nombre"}</small>
                  </>
                )}
              </h5>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
