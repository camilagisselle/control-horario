import React, { useState } from "react";
import { login as loginApi,  } from "./auth.service";
import type { LoginResponse } from "./auth.service"; // tipo-only
import { AuthContext } from "./auth.hook";

export interface AuthContextType {
  user: LoginResponse | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? (JSON.parse(stored) as LoginResponse) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};