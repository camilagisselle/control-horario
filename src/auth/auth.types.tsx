export interface JwtPayload {
  role: string;
  usuario: {
    correo: string;
    nombre: string;
    estado: number;
  };
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