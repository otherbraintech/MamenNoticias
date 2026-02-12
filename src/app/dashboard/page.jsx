"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsSection from "@/components/NewsSection";
import ActionButtons from "@/components/ActionButtons";
import { useNews } from "@/hooks/useNews";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import PageLoading from "@/components/PageLoading";
import { MdHistory, MdTrendingUp, MdListAlt } from "react-icons/md";

export default function HomePage() {
  const {
    noticias,
    loading,
    manejarEstado,
    actualizandoEstado,
    hayNoticias,
    articulosBrutos,
    statusMessage,
    refreshAction,
  } = useNews();

  const { 
    generarBoletin, 
    generando, 
    errorGen, 
    noticiasDescartadas,
    mostrarModal: mostrarModalPDF,
    confirmarYDescargar,
    cerrarModal
  } = usePDFGenerator(noticias);

  const errorMessage = errorGen;
  const [mensajeExtraccion, setMensajeExtraccion] = useState("");

  useEffect(() => {
    if (articulosBrutos && articulosBrutos.length > 0) {
      const ahora = new Date();
      const ultimo = articulosBrutos.reduce((a, b) => new Date(a.creado) > new Date(b.creado) ? a : b);
      const creado = new Date(ultimo.creado);
      const diffMin = (ahora - creado) / 1000 / 60;
      if (diffMin < 2) {
        setMensajeExtraccion("Extrayendo y filtrando noticias, espere unos minutos");
        return;
      }
    }
    setMensajeExtraccion("");
  }, [articulosBrutos]);

  if (loading) return <PageLoading message={statusMessage} />;

  const noticiasMamen = noticias.filter(n => n.categoria?.toUpperCase() === 'MAMEN');
  const noticiasOtros = noticias.filter(n => !n.categoria || ['OTROS', 'OTRO'].includes(n.categoria.toUpperCase()));

  if (!loading && noticias.length === 0) {
    return (
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-20 bg-gray-50/50">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 text-center max-w-xl border border-gray-100">
          <div className="w-20 h-20 bg-red-50 text-[#F22233] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MdListAlt size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">SIN NOTICIAS PARA HOY</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Aún no se han rastreado noticias para el día de hoy. Puedes explorar el historial para ver ediciones anteriores.
          </p>
          <Link href="/historial">
            <button className="w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-gray-200">
              <MdHistory size={20} />
              EXPLORAR HISTORIAL
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
                  <span className="text-[#F22233]">MAMEN</span> 
                  <span className="uppercase tracking-widest text-[#2BC7D9]">Noticias</span>
                </h1>
                <p className="hidden sm:block text-gray-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                  Panel de Monitoreo <span className="text-gray-200 mx-1">•</span> Medios Digitales
                </p>
              </div>

              {/* Mobile News Count Badge */}
              <div className="md:hidden bg-[#2BC7D9]/10 px-3 py-1.5 rounded-full">
                <span className="text-[10px] font-black tracking-widest text-[#2BC7D9] uppercase">
                  {noticias.length} NOTICIAS
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="hidden md:flex items-center gap-2">
                <div className="bg-white border border-gray-100 px-3 py-2 rounded-xl shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F22233] rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black tracking-widest text-[#2BC7D9] uppercase whitespace-nowrap">
                    {noticias.length} NOTICIAS HOY
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link href="/historial" className="flex-1 sm:flex-none">
                  <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#2BC7D9]/10 text-[#2BC7D9] hover:bg-[#2BC7D9] hover:text-white rounded-xl text-[10px] font-black tracking-widest uppercase transition-all active:scale-95">
                    <MdHistory className="text-sm" />
                    HISTORIAL
                  </button>
                </Link>
                <div className="flex-1 sm:flex-none">
                  <ActionButtons
                    generarBoletin={generarBoletin}
                    generando={generando}
                    errorGen={errorGen}
                    showFullButtons={true}
                    refreshAction={refreshAction}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {mensajeExtraccion && (
            <div className="mt-4 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-[0.2em] py-2 rounded-lg text-center animate-pulse">
              {mensajeExtraccion}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-16">
          <NewsSection
            title="NOTICIAS EXTRAIDAS HOY"
            noticias={noticias}
            colorClass="text-[#2BC7D9]"
            manejarEstado={manejarEstado}
            actualizandoEstado={actualizandoEstado}
            noNewsMessage="No hay noticias registradas hoy."
          />
        </div>
      </main>

      {mostrarModalPDF && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-white/20">
            <div className="p-8 pb-4 border-b border-gray-50 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">NOTICIAS CON ERROR</h2>
                <p className="text-gray-500 text-sm font-medium mt-1">
                  Las siguientes {noticiasDescartadas.length} noticias no se incluirán en el PDF.
                </p>
              </div>
            </div>
            <div className="p-8 py-4 overflow-y-auto max-h-[50vh] space-y-4">
              {noticiasDescartadas.map((n, i) => (
                <div key={i} className="bg-red-50/50 p-4 rounded-2xl border border-red-100 flex gap-4">
                  <div className="w-10 h-10 bg-red-100 text-[#F22233] rounded-xl flex items-center justify-center shrink-0 font-bold">!</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{n.titulo}</h4>
                    <p className="text-[10px] font-black text-[#F22233] uppercase tracking-wider">{n.error}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-gray-50 flex flex-col sm:flex-row gap-3">
              <button onClick={cerrarModal} className="flex-1 py-4 px-6 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-white/50 transition-all active:scale-95 uppercase text-xs tracking-widest">
                CANCELAR
              </button>
              <button onClick={confirmarYDescargar} className="flex-1 py-4 px-6 bg-[#F22233] text-white rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 uppercase text-xs tracking-widest shadow-lg shadow-red-100">
                CONTINUAR Y DESCARGAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}