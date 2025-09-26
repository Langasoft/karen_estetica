import { NextResponse } from "next/server";
import { query } from "@/services/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ci = searchParams.get('ci');
    if (!ci) return NextResponse.json({ citas: [] });

    // Traer próximas 3 citas futuras de agenda
    const rows = await query<{ id_agenda: number; fecha: string; hora: string; nombre_servicio: string }>(
      `SELECT a.id_agenda, a.fecha, a.hora, s.nombre_servicio
       FROM agenda a
       JOIN servicios s ON s.id_servicio = a.id_servicio
       WHERE a.ci_usuario = ? AND CONCAT(a.fecha,' ',a.hora) >= NOW()
       ORDER BY CONCAT(a.fecha,' ',a.hora) ASC
       LIMIT 3`,
      [ci]
    );

    return NextResponse.json({ citas: rows });
  } catch (e) {
    return NextResponse.json({ citas: [] });
  }
}


