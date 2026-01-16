import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminHistorial.css";

interface HistorialItem {
  id: number;
  usuario: string;
  fecha: string; // YYYY-MM-DD
  entrada: string;
  inicioColacion: string;
  finColacion: string;
  salida: string;
  totalHoras: string;
}

/* Usuarios (mantén nombres igual que en AdminUsuarios para buscar) */
const USUARIOS = ["Todos", "Juanito Perez", "María López", "Camila Pinilla"];

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const startOfWeekMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const isWeekday = (d: Date) => {
  const wd = d.getDay();
  return wd >= 1 && wd <= 5;
};

function AdminHistorial() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ----------------------
  // filtros
  // ----------------------
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>(
    "Todos"
  );
  const [filtroTiempo, setFiltroTiempo] = useState<"semana" | "mes" | "año">(
    "mes"
  );

  const [fechaSemana, setFechaSemana] = useState<string>(() => {
    const hoy = new Date();
    return hoy.toISOString().slice(0, 10);
  });

  const [mesSeleccionado, setMesSeleccionado] = useState<string>(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
  });

  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(
    new Date().getFullYear()
  );

  // ----------------------
  // datos de ejemplo
  // ----------------------
  const historial: HistorialItem[] = [
    {
      id: 1,
      usuario: "Juanito Perez",
      fecha: "2026-01-05",
      entrada: "08:00",
      inicioColacion: "12:30",
      finColacion: "13:15",
      salida: "17:30",
      totalHoras: "9.25",
    },
    {
      id: 2,
      usuario: "Juanito Perez",
      fecha: "2026-01-06",
      entrada: "08:10",
      inicioColacion: "12:30",
      finColacion: "13:15",
      salida: "17:40",
      totalHoras: "9.0",
    },
    {
      id: 3,
      usuario: "María López",
      fecha: "2026-01-05",
      entrada: "08:30",
      inicioColacion: "12:30",
      finColacion: "13:00",
      salida: "17:30",
      totalHoras: "8.5",
    },
    {
      id: 4,
      usuario: "Camila Pinilla",
      fecha: "2026-01-07",
      entrada: "08:15",
      inicioColacion: "13:00",
      finColacion: "14:00",
      salida: "17:15",
      totalHoras: "9.0",
    },
    {
      id: 5,
      usuario: "Camila Pinilla",
      fecha: "2025-12-01",
      entrada: "08:00",
      inicioColacion: "13:14",
      finColacion: "14:14",
      salida: "17:00",
      totalHoras: "9.0",
    },
    {
      id: 6,
      usuario: "Francisca Andrade",
      fecha: "2025-12-10",
      entrada: "08:00",
      inicioColacion: "13:00",
      finColacion: "14:00",
      salida: "18:00",
      totalHoras: "10.0",
    },
  ];

  const mapaRegistro = useMemo(() => {
    const m = new Map<string, HistorialItem>();
    for (const it of historial) {
      m.set(`${it.usuario}#${it.fecha}`, it);
    }
    return m;
  }, [historial]);

  const filas = useMemo(() => {
    const filasRes: Array<{ fecha: string; registro?: HistorialItem }> = [];

    if (usuarioSeleccionado !== "Todos") {
      if (filtroTiempo === "semana") {
        const base = new Date(fechaSemana);
        if (isNaN(base.getTime())) return filasRes;
        const lunes = startOfWeekMonday(base);
        for (let i = 0; i < 5; i++) {
          const dia = new Date(lunes);
          dia.setDate(lunes.getDate() + i);
          const ymd = toYMD(dia);
          filasRes.push({
            fecha: ymd,
            registro: mapaRegistro.get(`${usuarioSeleccionado}#${ymd}`),
          });
        }
      } else if (filtroTiempo === "mes") {
        const [y, m] = mesSeleccionado.split("-").map(Number);
        if (!y || !m) return filasRes;
        const total = daysInMonth(y, m - 1);
        for (let d = 1; d <= total; d++) {
          const dia = new Date(y, m - 1, d);
          if (!isWeekday(dia)) continue;
          const ymd = toYMD(dia);
          filasRes.push({
            fecha: ymd,
            registro: mapaRegistro.get(`${usuarioSeleccionado}#${ymd}`),
          });
        }
      } else if (filtroTiempo === "año") {
        const year = anioSeleccionado;
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);
        for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
          const dia = new Date(dt);
          if (!isWeekday(dia)) continue;
          const ymd = toYMD(dia);
          filasRes.push({
            fecha: ymd,
            registro: mapaRegistro.get(`${usuarioSeleccionado}#${ymd}`),
          });
        }
      }
    } else {
      for (const it of historial) {
        const fechaItem = new Date(it.fecha + "T00:00:00");
        if (!isWeekday(fechaItem)) continue;

        if (filtroTiempo === "semana") {
          const base = new Date(fechaSemana);
          if (isNaN(base.getTime())) continue;
          const lunes = startOfWeekMonday(base);
          const viernes = new Date(lunes);
          viernes.setDate(lunes.getDate() + 4);
          if (fechaItem < lunes || fechaItem > viernes) continue;
        } else if (filtroTiempo === "mes") {
          const [y, m] = mesSeleccionado.split("-").map(Number);
          if (!y || !m) continue;
          if (fechaItem.getFullYear() !== y || fechaItem.getMonth() + 1 !== m)
            continue;
        } else if (filtroTiempo === "año") {
          if (fechaItem.getFullYear() !== anioSeleccionado) continue;
        }

        filasRes.push({ fecha: it.fecha, registro: it });
      }

      filasRes.sort((a, b) => (a.fecha > b.fecha ? 1 : -1));
    }

    return filasRes;
  }, [
    usuarioSeleccionado,
    filtroTiempo,
    fechaSemana,
    mesSeleccionado,
    anioSeleccionado,
    mapaRegistro,
    historial,
  ]);

  // =========================
  // Mostrar tooltips en móvil (touch)
  // =========================
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const tooltipEl = target.closest(".has-tooltip") as HTMLElement | null;

      const visibles = document.querySelectorAll(".has-tooltip.tooltip-visible");
      visibles.forEach((el) => el.classList.remove("tooltip-visible"));

      if (tooltipEl) {
        tooltipEl.classList.add("tooltip-visible");
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const tooltipEl = target?.closest(".has-tooltip") as HTMLElement | null;
      if (!tooltipEl) {
        const visibles = document.querySelectorAll(".has-tooltip.tooltip-visible");
        visibles.forEach((el) => el.classList.remove("tooltip-visible"));
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="layout">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-avatar">👩 Administrador: Francisca Andrade</div>

        <Link to="/usuarios" className="menu has-tooltip" data-tooltip="Ir a usuarios">
          Usuarios
        </Link>

        <Link
          to="/historial"
          className="menu active has-tooltip"
          data-tooltip="Ir al historial"
        >
          Historial
        </Link>

        <div className="logout has-tooltip" data-tooltip="Cerrar sesión">Cerrar sesión</div>
      </aside>

      <main className="content">
        <header className="header">
          <button className="hamburger has-tooltip" onClick={() => setMenuOpen(!menuOpen)} data-tooltip="Abrir menú">
            ☰
          </button>

          <h1>Historial</h1>

          <img src="/krono2.1.png" className="logo" alt="Krono logo" />
        </header>

        <section className="card">
          <div className="actions">
            <div className="filter has-tooltip" data-tooltip="Selecciona el usuario a filtrar">
              <label>Usuario</label>
              <select
                value={usuarioSeleccionado}
                onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                aria-label="Filtrar por usuario"
              >
                {USUARIOS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter has-tooltip" data-tooltip="Selecciona el periodo">
              <label>Periodo</label>
              <select
                value={filtroTiempo}
                onChange={(e) =>
                  setFiltroTiempo(e.target.value as "semana" | "mes" | "año")
                }
                aria-label="Filtrar por periodo"
              >
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="año">Año</option>
              </select>
            </div>

            {filtroTiempo === "semana" && (
              <div className="filter has-tooltip" data-tooltip="Elige una fecha dentro de la semana">
                <label>Fecha (semana)</label>
                <input
                  type="date"
                  value={fechaSemana}
                  onChange={(e) => setFechaSemana(e.target.value)}
                />
                <small>Se toma la semana del lunes de la fecha escogida</small>
              </div>
            )}

            {filtroTiempo === "mes" && (
              <div className="filter has-tooltip" data-tooltip="Selecciona mes">
                <label>Mes</label>
                <input
                  type="month"
                  value={mesSeleccionado}
                  onChange={(e) => setMesSeleccionado(e.target.value)}
                />
              </div>
            )}

            {filtroTiempo === "año" && (
              <div className="filter has-tooltip" data-tooltip="Selecciona año">
                <label>Año</label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={anioSeleccionado}
                  onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <table>
            <thead>
              <tr>
                <th className="has-tooltip" data-tooltip="Nombre del usuario">Usuario</th>
                <th className="has-tooltip" data-tooltip="Fecha (YYYY-MM-DD)">Fecha</th>
                <th className="has-tooltip" data-tooltip="Hora de entrada">Entrada</th>
                <th className="has-tooltip" data-tooltip="Inicio colación">Inicio Colación</th>
                <th className="has-tooltip" data-tooltip="Fin colación">Fin Colación</th>
                <th className="has-tooltip" data-tooltip="Hora de salida">Salida</th>
                <th className="has-tooltip" data-tooltip="Total horas trabajadas">Total Horas</th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 && (
                <tr>
                  <td colSpan={7}>No hay registros</td>
                </tr>
              )}

              {filas.map((f) => {
                const r = f.registro;
                if (usuarioSeleccionado !== "Todos") {
                  return (
                    <tr key={f.fecha}>
                      <td>{usuarioSeleccionado}</td>
                      <td>{f.fecha}</td>
                      <td className="has-tooltip" data-tooltip={r ? `Entrada: ${r.entrada}` : "Sin registro"}>
                        {r ? r.entrada : "—"}
                      </td>
                      <td className="has-tooltip" data-tooltip={r ? `Inicio colación: ${r.inicioColacion}` : "Sin registro"}>
                        {r ? r.inicioColacion : "—"}
                      </td>
                      <td className="has-tooltip" data-tooltip={r ? `Fin colación: ${r.finColacion}` : "Sin registro"}>
                        {r ? r.finColacion : "—"}
                      </td>
                      <td className="has-tooltip" data-tooltip={r ? `Salida: ${r.salida}` : "Sin registro"}>
                        {r ? r.salida : "—"}
                      </td>
                      <td className="has-tooltip" data-tooltip={r ? `Total: ${r.totalHoras} hrs` : "Sin registro"}>
                        {r ? `${r.totalHoras} hrs` : "—"}
                      </td>
                    </tr>
                  );
                }

                return r ? (
                  <tr key={r.id}>
                    <td className="has-tooltip" data-tooltip={`Usuario: ${r.usuario}`}>{r.usuario}</td>
                    <td className="has-tooltip" data-tooltip={`Fecha: ${r.fecha}`}>{r.fecha}</td>
                    <td className="has-tooltip" data-tooltip={`Entrada: ${r.entrada}`}>{r.entrada}</td>
                    <td className="has-tooltip" data-tooltip={`Inicio colación: ${r.inicioColacion}`}>{r.inicioColacion}</td>
                    <td className="has-tooltip" data-tooltip={`Fin colación: ${r.finColacion}`}>{r.finColacion}</td>
                    <td className="has-tooltip" data-tooltip={`Salida: ${r.salida}`}>{r.salida}</td>
                    <td className="has-tooltip" data-tooltip={`Total: ${r.totalHoras} hrs`}>{r.totalHoras} hrs</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default AdminHistorial;