// auth.context.tsx
import React, { createContext, useContext, useState } from "react";
import { login as loginApi } from "./auth.service";
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  role: string;
  usuario: { correo: string; nombre: string; estado: number };
  iat: number;
  exp: number;
}

export interface LoginResponse {
  correo: string;
  role: string;
  name: string;
  token: string;
}

export interface AuthContextType {
  user: LoginResponse | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

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

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
