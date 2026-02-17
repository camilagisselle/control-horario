import { Outlet, useLocation } from "react-router-dom";
import AvatarMenu from "../Menu/Avatarmenu";
import Menuadmin from "../Menu/Menuadmin";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();
  const esAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="layout">

      {/* HEADER SUPERIOR */}
      <div className="layout-header">
        {esAdmin ? <Menuadmin /> : <AvatarMenu />}
      </div>

      {/* CONTENIDO */}
      <main className="page-content">
        <Outlet />
      </main>

      {/* LOGO */}
      <img src="/krono2.1.png" className="app-logo" alt="Logo" />

    </div>
  );
};

export default Layout;
