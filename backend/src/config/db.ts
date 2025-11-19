// src/config/db.ts
import mysql, { type Connection, type ConnectionOptions } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`❌ Variable de entorno ${key} no definida`);
  }
  return value;
}


const dbConfig: ConnectionOptions = {
  host: getEnvVar("DB_HOST"),
  user: getEnvVar("DB_USER"),
  password: getEnvVar("DB_PASSWORD"),
  database: getEnvVar("DB_NAME"),
  port: Number(getEnvVar("DB_PORT")),  // ← FALTA ESTO
};

export const db: Connection = mysql.createConnection(dbConfig);
