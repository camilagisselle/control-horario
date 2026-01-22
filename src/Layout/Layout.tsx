import { Outlet, useLocation } from "react-router-dom";
import AvatarMenu from "../Menu/Avatarmenu";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();

  const esAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="layout">
      {!esAdmin && <AvatarMenu />}
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
