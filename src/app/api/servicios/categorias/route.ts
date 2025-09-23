import { NextResponse } from 'next/server';
import { getCategorias } from '../../../servicios/server';

export async function GET() {
  try {
    const categorias = await getCategorias();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json({ error: 'Failed to fetch categorias' }, { status: 500 });
  }
}
