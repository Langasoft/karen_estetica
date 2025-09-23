/**
 * Server-side helpers for categories management
 * - getCategorias: fetch all categories
 * - deleteCategoria: remove category by id
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

export async function updateCategoria(id: number, nombre: string): Promise<{ success: boolean; message: string }> {
  try {
    await query(
      "UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?",
      [nombre, id]
    );
    return { success: true, message: "Categoría actualizada exitosamente" };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, message: "Error al actualizar la categoría" };
  }
}

export async function deleteCategoria(id: number): Promise<{ success: boolean; message: string }> {
  try {
    await query(
      "DELETE FROM categorias WHERE id_categoria = ?",
      [id]
    );
    return { success: true, message: "Categoría eliminada exitosamente" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: "Error al eliminar la categoría" };
  }
}
