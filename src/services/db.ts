/**
 * Database connection pool for MariaDB
 * Responsibility: provide query helper using env variables
 */
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "karen_estetica",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  connectionLimit: 5,
});

export async function query<T = unknown>(sql: string, params: any[] = []): Promise<T[]> {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    // mariadb returns extra metadata at rows.meta; we only need data
    if (Array.isArray(rows)) return rows as T[];
    return [] as T[];
  } finally {
    if (conn) conn.release();
  }
}


