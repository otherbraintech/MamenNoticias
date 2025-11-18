"use client";

import { useEffect, useState } from "react";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { useNews } from "@/hooks/useNews";
import { toast } from "sonner";

function formatISODate(date) {
  return date.toISOString().slice(0, 10);
}

export default function HistorialPage() {
  const { 
    noticias, 
    loading, 
    manejarEstado, 
    actualizandoEstado 
  } = useNews();
  const [error, setError] = useState(null);


  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [filteredNoticias, setFilteredNoticias] = useState([]);
  const { generarBoletin, generando } = usePDFGenerator(
    filteredNoticias.filter(n => n.estado === 'APROBADA')
  );

  async function fetchHistorial(params = {}) {
    try {
      setError(null);
      const search = new URLSearchParams();
      // Always use start/end date, with defaults if not provided
      search.set("start", params.start || startDate);
      search.set("end", params.end || endDate);
      const res = await fetch(`/api/noticias/historial?${search.toString()}`);
      if (!res.ok) {
        throw new Error("Error al cargar historial");
      }
      const data = await res.json();
      setFilteredNoticias(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Error desconocido");
    }
  }

  useEffect(() => {
    // Cargar con rango de fechas por defecto al montar
    fetchHistorial({ start: startDate, end: endDate });
  }, []); // solo una vez al montar


  function handleFilterByRange(e) {
    e.preventDefault();
    if (!startDate || !endDate) return;
    fetchHistorial({ start: startDate, end: endDate });
  }

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await manejarEstado(id, nuevoEstado);
      // Actualizar el estado local para reflejar los cambios
      setFilteredNoticias(prev => 
        prev.map(noticia => 
          noticia.id === id ? { ...noticia, estado: nuevoEstado } : noticia
        )
      );
      toast.success(`Noticia ${nuevoEstado.toLowerCase()} correctamente`);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado de la noticia');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 bg-white min-h-[70vh]">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F20519]">Historial de noticias</h1>
        <p className="text-gray-600 text-sm">
          Consulta las noticias anteriores filtrando por mes o por un rango específico de fechas.
        </p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <button
          onClick={() => generarBoletin()}
          disabled={generando || filteredNoticias.length === 0}
          className="bg-[#F20519] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d10416] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {generando ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
      </div>
      <section className="mb-6 grid gap-4 md:grid-cols-1">
        <form
          onSubmit={handleFilterByRange}
          className="bg-[#f5f5f5] p-4 rounded-lg shadow flex flex-col gap-2"
        >
          <h2 className="font-semibold mb-1 text-[#F20519]">Filtrar por rango de fechas</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#F20519]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#F20519]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!startDate || !endDate}
            className="mt-2 self-start bg-[#F20519] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d10416] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Aplicar rango
          </button>
        </form>
      </section>

      {loading && (
        <p className="text-center text-gray-500">Cargando noticias...</p>
      )}

      {error && !loading && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}

      {!loading && filteredNoticias.length === 0 && (
        <p className="text-center text-gray-500">No hay noticias para el período seleccionado.</p>
      )}

      {!loading && filteredNoticias.length > 0 && (
        <section className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredNoticias.map((noticia) => (
            <article
              key={noticia.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              {noticia.imagen && (
                <div className="mb-3">
                  <img 
                    src={noticia.imagen} 
                    alt={noticia.titulo || "Imagen de la noticia"}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {noticia.titulo || "Sin título"}
                </h2>
                <span className="text-xs text-gray-500">
                  {noticia.fecha_bolivia || noticia.fecha_utc || noticia.created_at}
                </span>
              </header>
              {noticia.resumen && (
                <p className="text-sm text-gray-700 mb-3">{noticia.resumen}</p>
              )}
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleEstadoChange(noticia.id, 'APROBADA')}
                  disabled={actualizandoEstado[noticia.id]}
                  className={`px-3 py-1 text-sm rounded ${
                    noticia.estado === 'APROBADA' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  } ${actualizandoEstado[noticia.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {actualizandoEstado[noticia.id] ? 'Actualizando...' : 'Aprobar'}
                </button>
                <button
                  onClick={() => handleEstadoChange(noticia.id, 'RECHAZADA')}
                  disabled={actualizandoEstado[noticia.id]}
                  className={`px-3 py-1 text-sm rounded ${
                    noticia.estado === 'RECHAZADA'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  } ${actualizandoEstado[noticia.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {actualizandoEstado[noticia.id] ? 'Actualizando...' : 'Rechazar'}
                </button>
              </div>
              {noticia.fuente && (
                <p className="text-xs text-gray-500">Fuente: {noticia.fuente}</p>
              )}
              {noticia.url && (
                <a
                  href={noticia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  Ver noticia original
                </a>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
