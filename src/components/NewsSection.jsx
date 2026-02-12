import NewsCard from "./NewsCard";

export default function NewsSection({
  title,
  noticias,
  colorClass,
  manejarEstado,
  actualizandoEstado,
  noNewsMessage,
}) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <h2 className={`text-sm sm:text-base font-black uppercase tracking-[0.3em] whitespace-nowrap ${colorClass}`}>
          {title}
        </h2>
        <div className="h-px bg-gray-100 flex-grow"></div>
      </div>
      
      {noticias.length > 0 ? (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <NewsCard
              key={noticia.id}
              noticia={noticia}
              manejarEstado={manejarEstado}
              estaActualizando={actualizandoEstado[noticia.id]}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{noNewsMessage}</p>
        </div>
      )}
    </section>
  );
}