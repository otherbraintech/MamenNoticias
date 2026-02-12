import Image from "next/image";
import { MdCheckCircle, MdCancel, MdOpenInNew } from "react-icons/md";
import { useState } from "react";

export default function NewsCard({ noticia, manejarEstado, estaActualizando }) {
  const estadoActual = noticia.estado?.toLowerCase() || null;
  const [imagenError, setImagenError] = useState(false);
  const [imagenCargando, setImagenCargando] = useState(true);
  
  const tieneImagenValida = noticia.imagen && !imagenError;

  return (
    <article className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Imagen Section */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-50">
        {tieneImagenValida ? (
          <Image
            src={noticia.imagen}
            alt={noticia.titulo}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imagenCargando ? 'blur-sm' : 'blur-0'}`}
            unoptimized
            priority
            onLoad={() => setImagenCargando(false)}
            onError={() => {
              setImagenError(true);
              setImagenCargando(false);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image
              src="https://i.ibb.co/fY1sCQCV/sin-Imagen.png"
              alt="Imagen no disponible"
              width={200}
              height={150}
              className="object-contain opacity-40"
              unoptimized
            />
          </div>
        )}
        
        {/* Category Badge if exists */}
        {noticia.categoria && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm ${
              noticia.categoria.toUpperCase() === 'MAMEN' 
                ? 'bg-[#F22233] text-white' 
                : 'bg-gray-800 text-white'
            }`}>
              {noticia.categoria}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Meta Info */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-[#2BC7D9] uppercase tracking-tight bg-[#2BC7D9]/10 px-2 py-0.5 rounded">
            {noticia.fuente || noticia.autor || "Medio Digital"}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            • {new Date(noticia.fecha_publicacion ?? "").toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight mb-3 line-clamp-2 group-hover:text-[#F22233] transition-colors">
          {noticia.titulo}
        </h2>

        {/* AI Summary */}
        <div className="mb-8 flex-grow">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
            &quot;{noticia.resumen_ia || noticia.resumen}&quot;
          </p>
        </div>

        {/* Actions Area */}
        <div className="mt-auto pt-6 border-t border-gray-50 flex flex-col gap-3">
          <a
            href={noticia.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#F22233] transition-colors w-fit"
          >
            VER NOTICIA ORIGINAL <MdOpenInNew className="text-sm" />
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => manejarEstado(noticia.id, "aprobado")}
              disabled={estaActualizando}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                estadoActual === "aprobado"
                  ? "bg-green-600 text-white shadow-md shadow-green-100"
                  : "bg-green-50 text-green-700 hover:bg-green-600 hover:text-white"
              } ${estaActualizando ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
            >
              <MdCheckCircle className="text-lg" />
              {estaActualizando && estadoActual === "aprobado" ? "..." : "Aprobar"}
            </button>
            <button
              onClick={() => manejarEstado(noticia.id, "rechazado")}
              disabled={estaActualizando}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                estadoActual === "rechazado"
                  ? "bg-[#F22233] text-white shadow-md shadow-red-100"
                  : "bg-red-50 text-[#F22233] hover:bg-[#F22233] hover:text-white"
              } ${estaActualizando ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
            >
              <MdCancel className="text-lg" />
              {estaActualizando && estadoActual === "rechazado" ? "..." : "Rechazar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}