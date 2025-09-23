/**
 * Server-side helpers for Servicios page
 * - getCategorias: fetch categories from MariaDB
 */
import { query } from "@/services/db";

export type Categoria = {
  id_categoria: number;
  nombre_categoria: string;
};

export type Servicio = {
  id_servicio: number;
  nombre_servicio: string;
  precio: number;
  duracion: number;
  id_categoria: number;
};

export async function getCategorias(): Promise<Categoria[]> {
  const rows = await query<Categoria>(
    "SELECT id_categoria, nombre_categoria FROM categorias ORDER BY nombre_categoria ASC"
  );
  return rows;
}

export async function getServicios(): Promise<Servicio[]> {
  const rows = await query<Servicio>(
    `SELECT s.id_servicio, s.nombre_servicio, s.precio, 
     EXTRACT(MINUTE FROM s.duracion) + (EXTRACT(HOUR FROM s.duracion) * 60) as duracion,
     s.id_categoria 
     FROM servicios s 
     ORDER BY s.id_categoria, s.nombre_servicio ASC`
  );
  return rows;
}


