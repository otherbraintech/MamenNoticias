
import { MdRefresh, MdPictureAsPdf } from "react-icons/md";

export default function ActionButtons({
  generarBoletin,
  generando,
  errorGen,
  refreshAction,
  showFullButtons = false,
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-2">
      {/* Botón de Actualizar Manual */}
      <button
        onClick={refreshAction}
        className="group flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 border border-gray-200 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
        title="Actualizar noticias"
      >
        <MdRefresh className={`text-xl text-[#F22233] transition-transform duration-500 group-hover:rotate-180`} />
        <span className="text-sm font-bold tracking-tight uppercase">Actualizar</span>
      </button>

      {showFullButtons && (
        <button
          onClick={generarBoletin}
          disabled={generando || !!errorGen}
          className={`flex items-center justify-center gap-2 bg-[#F22233] text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-tight uppercase transition-all duration-200 shadow-md hover:opacity-90 active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed ${
            errorGen ? 'bg-red-500' : ''
          }`}
        >
          {generando ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <MdPictureAsPdf className="text-xl text-white" />
              <span>{errorGen ? "Error PDF" : "Generar Reporte"}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}