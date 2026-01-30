import { Outlet, useLocation } from "react-router-dom";
import AvatarMenu from "../Menu/Avatarmenu";
import Menuadmin from "../Menu/Menuadmin";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();

  const esAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="layout">
      {esAdmin ? <Menuadmin /> : <AvatarMenu />}

      <main className="page-content probando-leseras">

          <img src="/krono2.1.png" className="registro-logo" alt="Logo" />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
