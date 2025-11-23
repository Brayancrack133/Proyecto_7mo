export const API_URL = "http://localhost:3000"; // Ajusta si tu backend usa otro puerto

// ---------------- LOGIN ----------------
export async function loginService(correo: string, contraseña: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contraseña }),
  });

  return await res.json();
}

// ---------------- REGISTER ----------------
export async function registerService(data: {
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
}) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await res.json();
}
