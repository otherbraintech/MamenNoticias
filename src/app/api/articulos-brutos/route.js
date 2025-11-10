import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const articulosBrutos = await prisma.articuloBruto.findMany({
      orderBy: { creado: "desc" }
    });

    return NextResponse.json(articulosBrutos, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });

  } catch (error) {
    console.error("Error al obtener artículos brutos:", error);
    return NextResponse.json(
      { 
        error: "Error al obtener artículos brutos", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Falta el campo 'url'" },
        { status: 400 }
      );
    }

    const articuloBruto = await prisma.articuloBruto.create({
      data: { url }
    });

    return NextResponse.json(articuloBruto, { status: 201 });

  } catch (error) {
    console.error("Error al crear artículo bruto:", error);
    return NextResponse.json(
      { 
        error: "Error al crear artículo bruto", 
        details: error.message 
      },
      { status: 400 }
    );
  }
}

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

    const articuloBruto = await prisma.articuloBruto.update({
      where: { id: Number(id) },
      data: { estado }
    });

    return NextResponse.json(articuloBruto, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar artículo bruto:", error);
    return NextResponse.json(
      { 
        error: "Error al actualizar artículo bruto", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
