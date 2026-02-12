"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { toast } from "sonner";
import PageLoading from "@/components/PageLoading";
import NewsCard from "@/components/NewsCard";
import { ChevronLeft, Filter, Calendar, FileText } from "lucide-react";

export default function HistorialPage() {
  const [loading, setLoading] = useState(true);
  const [noticias, setNoticias] = useState([]);
  const [actualizandoEstado, setActualizandoEstado] = useState({});
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [filteredNoticias, setFilteredNoticias] = useState([]);
  
  const { generarBoletin, generando } = usePDFGenerator(noticias);

  const fetchHistorial = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      setError(null);
      const search = new URLSearchParams();
      search.set("start", params.start || startDate);
      search.set("end", params.end || endDate);
      const res = await fetch(`/api/noticias/historial?${search.toString()}`);
      if (!res.ok) throw new Error("Error al cargar historial");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setFilteredNoticias(list);
      setNoticias(list);
    } catch (e) {
      console.error(e);
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchHistorial({ start: startDate, end: endDate });
  }, [fetchHistorial]); // Quitamos startDate y endDate para evitar auto-fetch

  const manejarEstado = async (id, nuevoEstado) => {
    try {
      setActualizandoEstado(prev => ({ ...prev, [id]: true }));
      setFilteredNoticias(prev => 
        prev.map(n => n.id === id ? { ...n, estado: nuevoEstado.toUpperCase() } : n)
      );
      setNoticias(prev => 
        prev.map(n => n.id === id ? { ...n, estado: nuevoEstado.toUpperCase() } : n)
      );

      const res = await fetch("/api/noticias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado.toUpperCase() }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      toast.success(`Noticia ${nuevoEstado.toLowerCase()} correctamente`);
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el estado');
    } finally {
      setActualizandoEstado(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <PageLoading message="Cargando historial..." />;

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <Link 
            href="/dashboard" 
            className="group inline-flex items-center text-gray-500 hover:text-[#F22233] transition-colors font-semibold text-xs uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            VOLVER AL DASHBOARD
          </Link>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight">
              HISTORIAL <span className="text-[#2BC7D9] uppercase">Noticias</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-xl font-medium">
              Explora, filtra y gestiona noticias de fechas anteriores para tus reportes.
            </p>
          </div>
          
          <button
            onClick={() => generarBoletin()}
            disabled={generando || filteredNoticias.length === 0}
            className="inline-flex items-center justify-center gap-2 bg-[#F22233] text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-red-100 transition-all active:scale-95 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
          >
            <FileText className="w-4 h-4" />
            {generando ? 'GENERANDO PDF...' : 'GENERAR REPORTE PDF'}
          </button>
        </div>

        {/* Filters Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <Filter className="w-4 h-4 text-[#F22233]" />
            <h2 className="font-bold uppercase text-xs tracking-wider">Filtrar por rango</h2>
          </div>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:w-auto flex-1">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5 ml-1">Desde</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#F22233]/20 transition-all cursor-pointer"
                />
              </div>
            </div>
            <div className="w-full md:w-auto flex-1">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5 ml-1">Hasta</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#F22233]/20 transition-all cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={() => fetchHistorial()}
              className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              BUSCAR NOTICIAS
            </button>
          </div>
        </section>

        {/* Content Section */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {filteredNoticias.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No se encontraron noticias para este período.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNoticias.map((noticia) => (
              <NewsCard 
                key={noticia.id} 
                noticia={noticia} 
                manejarEstado={manejarEstado} 
                estaActualizando={actualizandoEstado[noticia.id]} 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
