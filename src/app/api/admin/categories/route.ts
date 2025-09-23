import { NextRequest, NextResponse } from "next/server";
import { getCategorias } from "../../../admin/categories/server";
import { query } from '@/services/db';

export async function GET() {
  try {
    const categorias = await getCategorias();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();
    
    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ success: false, message: 'El nombre es requerido' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO categorias (nombre_categoria) VALUES (?)',
      [nombre.trim()]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Categoría creada exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al crear la categoría' 
    }, { status: 500 });
  }
}
