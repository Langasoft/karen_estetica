import { NextRequest, NextResponse } from "next/server";
import { updateCategoria, deleteCategoria } from "../../../../admin/categories/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr);
    const { nombre } = await request.json();
    
    if (isNaN(id) || !nombre) {
      return NextResponse.json(
        { success: false, message: "ID y nombre son requeridos" },
        { status: 400 }
      );
    }

    const result = await updateCategoria(id, nombre);
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const result = await deleteCategoria(id);
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}