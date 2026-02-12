
import { MdRefresh, MdPictureAsPdf } from "react-icons/md";

export default function ActionButtons({
  generarBoletin,
  generando,
  errorGen,
  refreshAction,
  showFullButtons = false,
}) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-1.5 justify-center items-center py-0.5 sm:py-2">
      {/* Botón de Actualizar Manual */}
      <button
        onClick={refreshAction}
        className="group flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white text-gray-700 px-2 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-gray-50 border border-gray-200 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
        title="Actualizar noticias"
      >
        <MdRefresh className={`text-base sm:text-xl text-[#F22233] transition-transform duration-500 group-hover:rotate-180`} />
        <span className="text-[9px] sm:text-sm font-black tracking-tight uppercase whitespace-nowrap">Actualizar</span>
      </button>

      {showFullButtons && (
        <button
          onClick={generarBoletin}
          disabled={generando || !!errorGen}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#F22233] text-white px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-sm tracking-tight uppercase transition-all duration-200 shadow-md hover:opacity-90 active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed ${
            errorGen ? 'bg-red-500' : ''
          }`}
        >
          {generando ? (
            <>
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="whitespace-nowrap">Generando...</span>
            </>
          ) : (
            <>
              <MdPictureAsPdf className="text-base sm:text-xl text-white" />
              <span className="whitespace-nowrap">{errorGen ? "Error" : "Reporte"}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}