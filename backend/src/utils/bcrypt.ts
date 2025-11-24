import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    // Intentamos comparar. Si 'hash' no es un hash válido (es texto plano), bcrypt lanzará error.
    return await bcrypt.compare(password, hash);
  } catch (error) {
    // Si falla (porque la DB tiene texto plano '123456'), no crasheamos.
    // Retornamos false para que el controlador decida qué hacer.
    console.log("⚠️ Advertencia: El hash en la DB no es válido (probablemente texto plano).");
    return false;
  }
}