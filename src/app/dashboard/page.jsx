"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsSection from "@/components/NewsSection";
import ActionButtons from "@/components/ActionButtons";
import LoadingModal from "@/components/LoadingModal";
import { useNews } from "@/hooks/useNews";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import PageLoading from "@/components/PageLoading";

export default function HomePage() {
  const {
    noticias,
    loading,
    ejecutarWebhook,
    manejarEstado,
    actualizandoEstado,
    ejecutandoWebhook,
    waiting,
    showModal,
    mostrarModalCargaNoticias,
    timer,
    noNews,
    webhookError,
    contador,
    horaLocal,
    hayNoticias,
    articulosBrutos,
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

  // Estado para manejar errores combinados
  const errorMessage = errorGen || webhookError;

  // Banner de extracción/filtrado de noticias
  const [mensajeExtraccion, setMensajeExtraccion] = useState("");

  // Estado para controlar la visibilidad del navbar en móviles
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Control del navbar en scroll para móviles
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) { // Solo en móviles
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - ocultar navbar
          setIsNavbarVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - mostrar navbar
          setIsNavbarVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Calcula la diferencia de tiempo con la última noticia extraída hoy
  useEffect(() => {
    // 1. Prioridad: ArticulosBrutos recientes (<2 min)
    if (articulosBrutos && articulosBrutos.length > 0) {
      const ahora = new Date();
      const ultimo = articulosBrutos.reduce((a, b) =>
        new Date(a.creado) > new Date(b.creado) ? a : b
      );
      const creado = new Date(ultimo.creado);
      const diffMin = (ahora - creado) / 1000 / 60;
      if (diffMin < 2) {
        setMensajeExtraccion(
          "Extrayendo y filtrando noticias, espere unos minutos"
        );
        return;
      }
    }

    // 2. Si no hay ArticulosBrutos recientes, usa la lógica de News
    if (!hayNoticias) {
      setMensajeExtraccion("");
      return;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const noticiasHoy = noticias.filter((n) => {
      const fecha = n.created_at ? new Date(n.created_at) : null;
      if (!fecha) return false;
      return fecha >= hoy;
    });
    if (noticiasHoy.length === 0) {
      setMensajeExtraccion("");
      return;
    }
    const ultima = noticiasHoy.reduce((a, b) => {
      const fechaA = a.created_at ? new Date(a.created_at) : new Date(0);
      const fechaB = b.created_at ? new Date(b.created_at) : new Date(0);
      return fechaA > fechaB ? a : b;
    });
    const fechaUltima = ultima.created_at ? new Date(ultima.created_at) : null;
    if (!fechaUltima) {
      setMensajeExtraccion("");
      return;
    }
    function actualizarMensaje() {
      // No mostrar ningún mensaje de procesamiento
      setMensajeExtraccion("");
    }
    actualizarMensaje();
    const interval = setInterval(actualizarMensaje, 10000); // Actualiza cada 10s
    return () => clearInterval(interval);
  }, [articulosBrutos, noticias, hayNoticias]);

  if (loading) {
    return <PageLoading />;
  }

  if (!loading && noticias.length === 0) {
    return (
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-10 bg-white max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center px-4">
          ¡Bienvenido! a MamenNoticias
        </h1>
        <p className="text-gray-500 text-lg mb-6 text-center font-semibold max-w-xl">
          Aun no se rastrearon noticias para hoy. Podés comenzar buscando noticias anteriores, haciendo clic aquí abajo.
        </p>

        <div className="mt-4">
          <Button className="bg-red-600 hover:bg-red-700">
            <Link href="/historial">
              Ver historial de noticias anteriores
            </Link>
          </Button>
        </div>

        {hayNoticias && contador !== null && (
          <p className="text-yellow-600 mt-4 text-center">
            Ya se extrajeron noticias. Podrás volver a cargar a las 8:30 am de
            mañana.
          </p>
        )}

        {errorMessage && (
          <p className="text-red-600 mt-4 text-center max-w-md">
            {errorMessage}
          </p>
        )}
        {showModal && mostrarModalCargaNoticias && (
          <LoadingModal timer={timer} />
        )}
      </main>
    );
  }

  return (
    <>
      {/* Header con comportamiento responsivo */}
      <header 
        className={`w-full transition-transform duration-300 ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        } sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200`}
      >
        <div className="rounded-2xl px-4 py-3 flex flex-col items-center justify-center bg-white shadow-sm max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-sky-400 text-center mb-1 flex items-center gap-2 tracking-wider">
            <span className="text-red-600 font-extrabold">MAMEN</span> NOTICIAS
            <span className="w-4 h-4 sm:w-5 sm:h-5 bg-red-600 rounded-full animate-pulse ml-1"></span>
          </h1>
          <span className="text-gray-700 text-sm sm:text-base font-light mb-2 text-center">
            Gestiona y aprueba noticias relevantes antes de generar tu boletín en PDF.
          </span>
          <div className="w-full flex justify-center mb-2">
            <ActionButtons
              ejecutarWebhook={ejecutarWebhook}
              generarBoletin={generarBoletin}
              ejecutandoWebhook={ejecutandoWebhook || waiting}
              generando={generando}
              hayNoticias={hayNoticias}
              contador={contador}
              errorGen={errorGen}
              webhookError={webhookError}
              showFullButtons={true}
            />
          </div>
          <div className="w-full flex justify-center">
            <Button variant="link" className="text-sm sm:text-base">
              <Link href="/historial">
                Ver historial de noticias
              </Link>
            </Button>
          </div>
          {hayNoticias && mensajeExtraccion && (
            <div
              className={`w-full px-2 py-2 rounded-md text-center font-semibold text-xs sm:text-sm ${
                mensajeExtraccion.includes("completó") ||
                mensajeExtraccion.includes("extraído")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-yellow-50 text-yellow-800 border border-yellow-200"
              }`}
            >
              {mensajeExtraccion}
            </div>
          )}
        </div>
      </header>

      {/* Contenido principal que ocupa el espacio restante */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-red-600 text-sm sm:text-base">{errorMessage}</p>
          </div>
        )}
        
        <div className="flex justify-center items-center text-lg sm:text-xl mb-4 sm:mb-6 text-black font-semibold">
          Noticias Extraídas: {noticias.length}
        </div>

        {/* Contenedor de noticias con scroll suave */}
        <div className="space-y-6 sm:space-y-8">
          {/* Mostrar noticias de Mamen Saavedra */}
          <NewsSection
            title="Mencionando a Mamen Saavedra"
            noticias={noticias.filter(noticia => 
              noticia.categoria && 
              noticia.categoria.toUpperCase() === 'MAMEN'
            )}
            colorClass="text-[#123488]"
            manejarEstado={manejarEstado}
            actualizandoEstado={actualizandoEstado}
            noNewsMessage="No hay noticias que mencionen a Mamen Saavedra."
          />

          {/* Mostrar noticias de Otros */}
          <NewsSection
            title="Otras noticias"
            noticias={noticias.filter(noticia => 
              !noticia.categoria || 
              noticia.categoria.toUpperCase() === 'OTROS' ||
              noticia.categoria.toUpperCase() === 'OTRO'
            )}
            colorClass="text-[#666666]"
            manejarEstado={manejarEstado}
            actualizandoEstado={actualizandoEstado}
            noNewsMessage="No hay otras noticias para mostrar."
          />
        </div>
      </main>

      {showModal && <LoadingModal timer={timer} />}
      
      {/* Modal para mostrar noticias descartadas */}
      {mostrarModalPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Noticias no procesadas en el PDF
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Las siguientes {noticiasDescartadas.length} noticias no pudieron ser procesadas debido a errores:
              </p>
            </div>
            
            <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                {noticiasDescartadas.map((noticia, index) => (
                  <div key={index} className="border-l-4 border-red-400 pl-3 sm:pl-4 py-2 bg-red-50 rounded-r">
                    <div className="font-semibold text-gray-800 text-sm sm:text-base">
                      ID: {noticia.id} - {noticia.titulo}
                    </div>
                    <div className="text-xs sm:text-sm text-red-600 mt-1">
                      <strong>Motivo:</strong> {noticia.error}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarYDescargar}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base order-1 sm:order-2"
              >
                Aceptar y Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}