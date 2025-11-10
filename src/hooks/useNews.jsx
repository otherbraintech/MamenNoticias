import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useNews() {
  const [articulosBrutos, setArticulosBrutos] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ejecutandoWebhook, setEjecutandoWebhook] = useState(false);
  const [webhookError, setWebhookError] = useState(null);
  const [timer, setTimer] = useState(20);
  const [waiting, setWaiting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [noNews, setNoNews] = useState(false);
  const [intentosSinNoticias, setIntentosSinNoticias] = useState(0);
  const [actualizandoEstado, setActualizandoEstado] = useState({});
  const [contador, setContador] = useState(null);
  const [horaLocal, setHoraLocal] = useState("");
  const [mostrarModalCargaNoticias, setMostrarModalCargaNoticias] = useState(false);
  const [mensajeCargaNoticias, setMensajeCargaNoticias] = useState('Extrayendo noticias...');

  // Todas las noticias juntas
  const hayNoticias = noticias.length > 0;

  useEffect(() => {
    const updateHora = () => {
      const ahora = new Date();
      setHoraLocal(ahora.toLocaleTimeString());
    };
    updateHora();
    const interval = setInterval(updateHora, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    async function fetchNoticias() {
      try {
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
        
        // Filtrar noticias del día actual (Bolivia time)
        const hoyBolivia = new Date();
        hoyBolivia.setHours(0, 0, 0, 0); // Inicio del día actual
        
        const noticiasHoy = data.filter(noticia => {
          if (!noticia.created_at) return false;
          const fechaNoticia = new Date(noticia.created_at);
          return fechaNoticia >= hoyBolivia;
        });
        
        setNoticias(noticiasHoy);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNoticias([]);
      } finally {
        setLoading(false);
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
    fetchNoticias();
    fetchArticulosBrutos();
    interval = setInterval(() => {
      fetchNoticias();
      fetchArticulosBrutos();
    }, 20000); // 20 segundos
    return () => clearInterval(interval);
  }, []);

  // Efecto para el contador de recarga
  useEffect(() => {
    let interval;
    function updateContador() {
      if (hayNoticias) {
        setContador(getTiempoRestanteHasta830amSiguiente());
      } else {
        setContador(null);
      }
    }
    updateContador();
    if (hayNoticias) {
      interval = setInterval(updateContador, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hayNoticias]);

  async function esperarCambioNoticias(condicionCambio, maxIntentos = 3, mostrarModal = true) {
    if (mostrarModal) {
      setWaiting(true);
      setShowModal(true);
    }
    setNoNews(false);
    setTimer(20);
    setIntentosSinNoticias(0);

    let keepWaiting = true;
    let foundCambio = false;
    let intentos = 0;

    try {
      while (keepWaiting) {
        for (let t = 20; t > 0; t--) {
          setTimer(t);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        setTimer(0);

        const noticiasRes = await fetch("/api/noticias");
        const nuevasNoticias = await noticiasRes.json();

        if (condicionCambio(nuevasNoticias)) {
          setNoticias(nuevasNoticias);
          foundCambio = true;
          keepWaiting = false;
          if (mostrarModal) {
            setWaiting(false);
            setShowModal(false);
          }
          setIntentosSinNoticias(0);
          setNoNews(false);
          break;
        } else {
          intentos++;
          setIntentosSinNoticias(intentos);
          if (intentos >= maxIntentos) {
            setNoNews(true);
          }
        }
      }
      if (!foundCambio && mostrarModal) {
        setWaiting(false);
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
      setWebhookError("Error al esperar cambios en las noticias.");
      if (mostrarModal) {
        setWaiting(false);
        setShowModal(false);
      }
      setIntentosSinNoticias(0);
      setNoNews(false);
    }
  }

  async function ejecutarWebhook() {
    setEjecutandoWebhook(true);
    setWebhookError(null);
    setMostrarModalCargaNoticias(true);
    
    // Mostrar notificación de carga
    const loadingToast = toast.loading('Iniciando extracción de noticias...');
    
    try {
      // Iniciar el contador
      let contador = 0;
      const intervalo = setInterval(() => {
        contador++;
        const mensaje = `Extrayendo noticias... (${contador}s)`;
        setMensajeCargaNoticias(mensaje);
        // Actualizar notificación de carga
        toast.loading(mensaje, { id: loadingToast });
      }, 1000);
      
      // Realizar la petición al webhook de n8n sin esperar respuesta
      const response = await fetch(
        "https://political-news-n8n.af9gwe.easypanel.host/webhook-test/mamennoticias",
        { 
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ timestamp: new Date().toISOString() })
        }
      );
      
      // Limpiar el intervalo cuando se complete la operación
      clearInterval(intervalo);
      
      // Mostrar notificación de éxito
      toast.success('¡Extracción de noticias completada con éxito!', { 
        id: loadingToast,
        duration: 5000
      });
      
      return response;
      
    } catch (err) {
      console.error('Error en ejecutarWebhook:', err);
      setWebhookError('Se inició la extracción de noticias en segundo plano.');
      
      // Mostrar notificación de error
      toast.error('Error al iniciar la extracción de noticias', { 
        id: loadingToast,
        description: 'La extracción continúa en segundo plano.'
      });
      
      throw err;
    } finally {
      // Mantener el modal visible por al menos 2 segundos para feedback visual
      setTimeout(() => {
        setEjecutandoWebhook(false);
        setMostrarModalCargaNoticias(false);
        setMensajeCargaNoticias('Extrayendo noticias...'); // Restaurar mensaje por defecto
      }, 2000);
    }
  }
  
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
  
  function getTiempoRestanteHasta830amSiguiente() {
    const ahora = new Date();
    const ahoraBolivia = new Date(
      ahora.toLocaleString("en-US", { timeZone: "America/La_Paz" })
    );
    let siguiente830 = new Date(ahoraBolivia);
    siguiente830.setHours(8, 30, 0, 0);

    if (ahoraBolivia >= siguiente830) {
      siguiente830.setDate(siguiente830.getDate() + 1);
    }

    const diff = siguiente830 - ahoraBolivia;
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    return { horas, minutos, segundos };
  }

  return {
    noticias,
    articulosBrutos,
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
    hayNoticias
  };
}
