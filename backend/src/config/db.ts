import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variable de entorno ${key} no definida`);
  }
  return value;
}

export const db = mysql.createPool({
  host: getEnvVar('DB_HOST'),
  user: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD'),
  database: getEnvVar('DB_NAME'),
  port: Number(getEnvVar("DB_PORT")),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
}).promise();
