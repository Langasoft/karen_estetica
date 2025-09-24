import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "../../register/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const result = await registerUser(username, password);
    
    return NextResponse.json(result, { 
      status: result.success ? 201 : 400 
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
