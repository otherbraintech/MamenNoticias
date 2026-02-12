import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const zonaBolivia = "America/La_Paz";

    // Obtenemos el inicio del día actual en Bolivia
    const inicioHoyBolivia = DateTime.now().setZone(zonaBolivia).startOf("day").toUTC().toJSDate();

    // Traemos solo las noticias del día actual
    const noticiasHoy = await prisma.news.findMany({
      where: {
        created_at: {
          gte: inicioHoyBolivia,
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Mapear para formatear las fechas
    const noticiasConFechaFormateada = noticiasHoy.map((noticia) => {
      const fechaUTC = DateTime.fromJSDate(noticia.created_at).toUTC();
      const fechaBolivia = fechaUTC.setZone(zonaBolivia);

      return {
        ...noticia,
        created_at: fechaBolivia.toISO(),
        fecha_bolivia: fechaBolivia.toFormat("dd/MM/yyyy HH:mm:ss"),
        fecha_utc: fechaUTC.toFormat("dd/MM/yyyy HH:mm:ss"),
      };
    });

    console.log(`[DEBUG] Noticias de hoy encontradas: ${noticiasConFechaFormateada.length}`);

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
