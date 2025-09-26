import { NextResponse } from "next/server";
import { query } from "@/services/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ci = searchParams.get('ci');
    if (!ci) return NextResponse.json({});
    const rows = await query<{ nombre:string; apellido:string; email:string; telefono: string | number }>(
      "SELECT nombre, apellido, email, telefono FROM usuarios WHERE ci_usuario = ?",
      [ci]
    );
    const r = rows[0] || {} as any;
    if (r.telefono !== undefined && r.telefono !== null) {
      r.telefono = String(r.telefono);
    }
    return NextResponse.json(r);
  } catch (e) {
    return NextResponse.json({});
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { ci, nombre, apellido, telefono, email } = body as {
      ci: string;
      nombre: string;
      apellido: string;
      telefono: string;
      email: string;
    };

    const ciNum = String(ci).replace(/\D/g, "");
    if (!ciNum) return NextResponse.json({ success: false, message: 'CI requerido' }, { status: 400 });

    await query(
      "UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, email = ? WHERE ci_usuario = ?",
      [nombre ?? '', apellido ?? '', telefono ?? '', email ?? '', ciNum]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}


