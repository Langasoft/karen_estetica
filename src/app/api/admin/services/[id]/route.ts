import { NextRequest, NextResponse } from "next/server";
import { query } from '@/services/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { nombre_servicio, id_categoria, precio, duracion } = await request.json();
    
    if (isNaN(id) || !nombre_servicio || !id_categoria || !precio || !duracion) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    await query(
      "UPDATE servicios SET nombre_servicio = ?, id_categoria = ?, precio = ?, duracion = TIME_FORMAT(SEC_TO_TIME(? * 60), '%H:%i:%s') WHERE id_servicio = ?",
      [nombre_servicio.trim(), id_categoria, precio, duracion, id]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "Servicio actualizado exitosamente" 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
