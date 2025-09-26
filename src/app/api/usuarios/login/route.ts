import { NextResponse } from "next/server";
import { query } from "@/services/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { ci, password } = await req.json();
    if (!ci || !password) {
      return NextResponse.json({ success: false, message: "Faltan datos" }, { status: 400 });
    }

    const ciNum = String(ci).replace(/\D/g, "");
    const rows = await query<{ ci_usuario: number; password: string; validado: number }>(
      "SELECT ci_usuario, password, validado FROM usuarios WHERE ci_usuario = ?",
      [ciNum]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 });
    }

    return NextResponse.json({ success: true, validado: user.validado ?? 0 });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Error del servidor" }, { status: 500 });
  }
}


