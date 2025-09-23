import { NextResponse } from 'next/server';
import { getServicios } from '../../../servicios/server';

export async function GET() {
  try {
    const servicios = await getServicios();
    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return NextResponse.json({ error: 'Failed to fetch servicios' }, { status: 500 });
  }
}
