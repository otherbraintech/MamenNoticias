import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useNews() {
  const [articulosBrutos, setArticulosBrutos] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizandoEstado, setActualizandoEstado] = useState({});
  const [statusMessage, setStatusMessage] = useState('Buscando noticias...');

  // Todas las noticias juntas
  const hayNoticias = noticias.length > 0;

  async function fetchNoticias() {
    try {
      setStatusMessage('Buscando noticias de hoy...');
      const res = await fetch("/api/noticias", {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      let data = await res.json();
      if (!Array.isArray(data)) data = [];
      
      // El API ya filtra por hoy, pero mantenemos la lógica por si el API cambia
      const hoyBolivia = new Date();
      hoyBolivia.setHours(0, 0, 0, 0); 
      
      const noticiasHoy = data.filter(noticia => {
        if (!noticia.created_at) return false;
        const fechaNoticia = new Date(noticia.created_at);
        return fechaNoticia >= hoyBolivia;
      });

      const count = noticiasHoy.length;
      setStatusMessage(`Noticias encontradas de hoy: ${count}`);
      
      // Pequeño delay para que el usuario vea el contador antes de mostrar las noticias
      if (count > 0) {
        setTimeout(() => {
          setStatusMessage('Cargando noticias encontradas...');
          setNoticias(noticiasHoy);
        }, 800);
      } else {
        setNoticias(noticiasHoy);
      }

    } catch (error) {
      console.error("Error fetching news:", error);
      setStatusMessage('Error al buscar noticias.');
      setNoticias([]);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }

  async function fetchArticulosBrutos() {
    try {
      const res = await fetch("/api/articulos-brutos", {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      let data = await res.json();
      if (!Array.isArray(data)) data = [];
      setArticulosBrutos(data);
    } catch (e) {
      setArticulosBrutos([]);
    }
  }

  const refreshAction = () => {
    setLoading(true);
    fetchNoticias();
    fetchArticulosBrutos();
  };

  useEffect(() => {
    fetchNoticias();
    fetchArticulosBrutos();
  }, []);

  async function manejarEstado(id, nuevoEstado) {
    // Aplica el cambio local optimista
    setNoticias((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, estado: nuevoEstado.toUpperCase() } : n
      )
    );
  
    setActualizandoEstado((prev) => ({ ...prev, [id]: true }));
  
    try {
      const res = await fetch("/api/noticias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado.toUpperCase() }),
      });
  
      if (!res.ok) throw new Error("Error al actualizar estado");
      await res.json();
    } catch (err) {
      alert("No se pudo actualizar el estado de la noticia.");
    } finally {
      setActualizandoEstado((prev) => ({ ...prev, [id]: false }));
    }
  }

  return {
    noticias,
    articulosBrutos,
    loading,
    manejarEstado,
    actualizandoEstado,
    hayNoticias,
    statusMessage,
    refreshAction
  };
}
