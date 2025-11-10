import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const zonaBolivia = "America/La_Paz";

    // Traemos todas las noticias ordenadas por fecha (desc)
    const todasNoticias = await prisma.news.findMany({
      orderBy: { created_at: "desc" },
    });

    // Mapear para formatear las fechas
    const noticiasConFechaFormateada = todasNoticias.map((noticia) => {
      const fechaUTC = DateTime.fromJSDate(noticia.created_at).toUTC();
      const fechaBolivia = fechaUTC.setZone(zonaBolivia);

      return {
        ...noticia,
        created_at: fechaBolivia.toISO(),
        fecha_bolivia: fechaBolivia.toFormat("dd/MM/yyyy HH:mm:ss"),
        fecha_utc: fechaUTC.toFormat("dd/MM/yyyy HH:mm:ss"),
      };
    });

    console.log(`[DEBUG] Noticias encontradas: ${noticiasConFechaFormateada.length}`);

    return NextResponse.json(noticiasConFechaFormateada, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return NextResponse.json(
      { error: 'Error al obtener noticias' },
      { status: 500 }
    );
  }
}
// PUT permanece igual
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, estado } = body;

    if (!id || !estado) {
      return NextResponse.json(
        { error: "Faltan campos: 'id' o 'estado'" },
        { status: 400 }
      );
    }

    const noticiaActualizada = await prisma.news.update({
      where: { id: Number(id) },
      data: { estado },
    });

    return NextResponse.json(noticiaActualizada, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar noticia", detail: error.message },
      { status: 500 }
    );
  }
}
