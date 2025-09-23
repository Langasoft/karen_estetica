/**
 * Server-side helpers for Servicios page
 * - getCategorias: fetch categories from MariaDB
 */
import { query } from "@/services/db";

export type Categoria = {
  id_categoria: number;
  nombre_categoria: string;
};

export async function getCategorias(): Promise<Categoria[]> {
  const rows = await query<Categoria>(
    "SELECT id_categoria, nombre_categoria FROM categorias ORDER BY nombre_categoria ASC"
  );
  return rows;
}


