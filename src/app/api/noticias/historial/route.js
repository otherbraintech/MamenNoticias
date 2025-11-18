import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const monthParam = searchParams.get("month"); // formato esperado: YYYY-MM
    const startParam = searchParams.get("start"); // YYYY-MM-DD
    const endParam = searchParams.get("end"); // YYYY-MM-DD

    const zonaBolivia = "America/La_Paz";

    let fechaInicio;
    let fechaFin;

    if (startParam && endParam) {
      const inicio = DateTime.fromISO(startParam, { zone: zonaBolivia }).startOf("day");
      const fin = DateTime.fromISO(endParam, { zone: zonaBolivia }).endOf("day");

      if (!inicio.isValid || !fin.isValid) {
        return NextResponse.json(
          { error: "Fechas inválidas" },
          { status: 400 }
        );
      }

      fechaInicio = inicio.toUTC().toJSDate();
      fechaFin = fin.toUTC().toJSDate();
    } else {
      const base = monthParam
        ? DateTime.fromFormat(monthParam, "yyyy-MM", { zone: zonaBolivia }).startOf("month")
        : DateTime.now().setZone(zonaBolivia).startOf("month");

      if (!base.isValid) {
        return NextResponse.json(
          { error: "Mes inválido" },
          { status: 400 }
        );
      }

      const finMes = base.endOf("month");

      fechaInicio = base.toUTC().toJSDate();
      fechaFin = finMes.toUTC().toJSDate();
    }

    const noticias = await prisma.news.findMany({
      where: {
        created_at: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      orderBy: { created_at: "desc" },
    });

    const noticiasConFechaFormateada = noticias.map((noticia) => {
      const fechaUTC = DateTime.fromJSDate(noticia.created_at).toUTC();
      const fechaBolivia = fechaUTC.setZone(zonaBolivia);

      return {
        ...noticia,
        created_at: fechaBolivia.toISO(),
        fecha_bolivia: fechaBolivia.toFormat("dd/MM/yyyy HH:mm:ss"),
        fecha_utc: fechaUTC.toFormat("dd/MM/yyyy HH:mm:ss"),
      };
    });

    return NextResponse.json(noticiasConFechaFormateada, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al obtener historial de noticias:", error);
    return NextResponse.json(
      { error: "Error al obtener historial de noticias" },
      { status: 500 }
    );
  }
}
