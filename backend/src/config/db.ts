// src/config/db.ts
import mysql, { type Connection, type ConnectionOptions } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Función helper para obtener variables de entorno requeridas
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variable de entorno ${key} no definida`);
  }
  return value;
}

const dbConfig: ConnectionOptions = {
  host: getEnvVar("DB_HOST"),
  user: getEnvVar("DB_USER"),
  password: getEnvVar("DB_PASSWORD"),
  database: getEnvVar("DB_NAME"),
};

export const db: Connection = mysql.createConnection(dbConfig);