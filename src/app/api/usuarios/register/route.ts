import { NextResponse } from "next/server";
import { query } from "@/services/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ci, nombre, apellido, telefono, email } = body as {
      ci: string;
      nombre: string;
      apellido: string;
      telefono: string;
      email: string;
    };

    const ciNum = ci.replace(/\D/g, "");
    if (!ciNum || !nombre || !apellido || !telefono || !email) {
      return NextResponse.json({ success: false, message: "Faltan campos" }, { status: 400 });
    }

    const exist = await query<{ count: number }>(
      "SELECT COUNT(*) as count FROM usuarios WHERE ci_usuario = ?",
      [ciNum]
    );
    if (exist[0]?.count > 0) {
      return NextResponse.json({ success: false, exists: true, message: "El usuario ya existe" }, { status: 200 });
    }

    const hashed = await bcrypt.hash(telefono, 10);
    await query(
      "INSERT INTO usuarios (ci_usuario, nombre, apellido, telefono, email, password) VALUES (?, ?, ?, ?, ?, ?)",
      [ciNum, nombre, apellido, telefono, email, hashed]
    );

    return NextResponse.json({ success: true, message: "Usuario registrado" });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Error del servidor" }, { status: 500 });
  }
}


