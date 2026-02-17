import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "./auth.context";
import { login as loginApi } from "./auth.service";
import type { JwtPayload } from "./auth.types";
import type { LoginResponse } from "./auth.types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);

    const decoded = jwtDecode<JwtPayload>(data.token);

    const userWithInfo: LoginResponse = {
      token: data.token,
      correo: decoded.usuario.correo,
      name: decoded.usuario.nombre,
      role: decoded.role,
    };

    setUser(userWithInfo);
    localStorage.setItem("user", JSON.stringify(userWithInfo));

    return userWithInfo;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (data: Partial<LoginResponse>) => {
    setUser(prev => {
      if (!prev) return prev;

      const updated = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};