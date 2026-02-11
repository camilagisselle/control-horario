export type LoginResponse = {
  correo: string;
  role: string;
  name: string;
  token: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch("http://localhost:8080/v1/control-horario/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: email,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const data: LoginResponse = await res.json();
  // console.log("Data recibida del back:", data);
  return data;
}