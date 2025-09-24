/**
 * Server-side helpers for user authentication
 * - loginUser: verify credentials and return auth result
 */
import { query } from "@/services/db";
import bcrypt from "bcryptjs";

export async function loginUser(username: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    // Buscar usuario
    const users = await query<{ id_user: number; user_name: string; user_password: string }>(
      "SELECT id_user, user_name, user_password FROM users WHERE user_name = ?",
      [username]
    );

    if (users.length === 0) {
      return { success: false, message: "Usuario o contraseña incorrectos" };
    }

    const user = users[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.user_password);

    if (!isValidPassword) {
      return { success: false, message: "Usuario o contraseña incorrectos" };
    }

    return { success: true, message: "Login exitoso" };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}
