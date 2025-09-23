import { NextRequest, NextResponse } from "next/server";
import { query } from '@/services/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    
    let whereClause = '';
    let queryParams: any[] = [];
    
    if (categoria && categoria !== '0') {
      whereClause = 'WHERE s.id_categoria = ?';
      queryParams = [categoria];
    }
    
    const services = await query(`
      SELECT 
        s.id_servicio,
        s.nombre_servicio,
        s.precio,
        s.id_categoria,
        EXTRACT(MINUTE FROM s.duracion) + (EXTRACT(HOUR FROM s.duracion) * 60) as duracion,
        c.nombre_categoria
      FROM servicios s
      LEFT JOIN categorias c ON s.id_categoria = c.id_categoria
      ${whereClause}
      ORDER BY c.nombre_categoria ASC, s.nombre_servicio ASC
    `, queryParams);
    
    return NextResponse.json(services);
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
    const { nombre_servicio, id_categoria, precio, duracion } = await request.json();
    
    if (!nombre_servicio || !id_categoria || !precio || !duracion) {
      return NextResponse.json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO servicios (nombre_servicio, id_categoria, precio, duracion) VALUES (?, ?, ?, TIME_FORMAT(SEC_TO_TIME(? * 60), \'%H:%i:%s\'))',
      [nombre_servicio.trim(), id_categoria, precio, duracion]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Servicio creado exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al crear el servicio' 
    }, { status: 500 });
  }
}
