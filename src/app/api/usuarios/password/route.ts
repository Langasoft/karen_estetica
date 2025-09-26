import { NextResponse } from "next/server";
import { query } from "@/services/db";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const { ci, password } = await req.json();
    if (!password) return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 });

    // En este ejemplo el CI se puede tomar del localStorage/estado, pero se permite enviarlo
    const ciNum = ci ? String(ci).replace(/\D/g, '') : null;
    if (!ciNum) return NextResponse.json({ success: false, message: 'CI requerido' }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    await query("UPDATE usuarios SET password = ?, validado = 1 WHERE ci_usuario = ?", [hashed, ciNum]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}


