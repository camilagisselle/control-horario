import "./HistorialPage.css";

type Registro = {
  fecha: string;
  entrada: string;
  inicioColacion: string;
  finColacion: string;
  salida: string;
  total: string;
};

const registros: Registro[] = [
  {
    fecha: "23/10/2023",
    entrada: "08:00 AM",
    inicioColacion: "13:14 PM",
    finColacion: "14:14 PM",
    salida: "17:00 PM",
    total: "9.0 hrs",
  },
  {
    fecha: "24/10/2023",
    entrada: "08:15 AM",
    inicioColacion: "13:00 PM",
    finColacion: "14:00 PM",
    salida: "17:15 PM",
    total: "9.0 hrs",
  },
  {
    fecha: "25/10/2023",
    entrada: "07:55 AM",
    inicioColacion: "13:05 PM",
    finColacion: "14:05 PM",
    salida: "16:55 PM",
    total: "9.0 hrs",
  },
  {
    fecha: "26/10/2023",
    entrada: "08:05 AM",
    inicioColacion: "13:00 PM",
    finColacion: "14:00 PM",
    salida: "18:05 PM",
    total: "10.0 hrs",
  },
  {
    fecha: "27/10/2023",
    entrada: "08:00 AM",
    inicioColacion: "13:30 PM",
    finColacion: "14:30 PM",
    salida: "15:00 PM",
    total: "5.0 hrs",
  },
];

export default function HistorialPage() {
  return (
    <div className="historial-container">
      {/* HEADER */}
      <header className="historial-header">
        <div>
          <p className="usuario-label">Usuario:</p>
          <h2 className="usuario-nombre">Camila Pinilla Cabrera</h2>
        </div>

        <div className="logo">KRONO</div>
      </header>

      {/* BOTÓN FILTROS */}
      <button className="btn-filtros">Filtros ▼</button>

      {/* TABLA */}
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora Entrada</th>
              <th>Inicio Colación</th>
              <th>Fin Colación</th>
              <th>Hora Salida</th>
              <th>Total de Horas</th>
            </tr>
          </thead>

          <tbody>
            {registros.map((r, index) => (
              <tr key={index}>
                <td>
                  <span className="fecha-pill">{r.fecha}</span>
                </td>
                <td>{r.entrada}</td>
                <td>{r.inicioColacion}</td>
                <td>{r.finColacion}</td>
                <td>{r.salida}</td>
                <td>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="paginacion">
        <button>&lt; ANTERIOR</button>
        <span className="pagina-activa">1</span>
        <button>SIGUIENTE &gt;</button>
      </div>
    </div>
  );
}