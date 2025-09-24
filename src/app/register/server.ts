/**
 * Server-side helpers for user registration
 * - registerUser: insert user with encrypted password
 */
import { query } from "@/services/db";
import bcrypt from "bcryptjs";

export type User = {
  id_user: number;
  user_name: string;
  user_password: string;
};

export async function registerUser(username: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    // Verificar si el usuario ya existe
    const existingUsers = await query<User>(
      "SELECT id_user FROM users WHERE user_name = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return { success: false, message: "El usuario ya existe" };
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    await query(
      "INSERT INTO users (user_name, user_password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    return { success: true, message: "Usuario registrado exitosamente" };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}
