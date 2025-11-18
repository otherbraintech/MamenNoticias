import { useState } from "react";
import jsPDF from "jspdf";

export function usePDFGenerator(noticias) {
  const [generando, setGenerando] = useState(false);
  const [errorGen, setErrorGen] = useState(null);
  const [noticiasDescartadas, setNoticiasDescartadas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pdfPendiente, setPdfPendiente] = useState(null);

  // Función mejorada para obtener imágenes con mejor manejo de errores
  async function getBase64ImageFromUrl(imageUrl) {
    // Validación más estricta de la URL
    const isValidUrl = imageUrl && 
                      typeof imageUrl === 'string' && 
                      imageUrl.trim() !== '' && 
                      (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
    
    // Si la URL no es válida, usar imagen por defecto inmediatamente
    if (!isValidUrl) {
      console.log('URL de imagen inválida o faltante, usando imagen por defecto');
      return await getFallbackImage();
    }

    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      console.log('Intentando cargar imagen:', imageUrl);
      
      // Timeout para evitar esperas largas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout
      
      const response = await fetch(proxyUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('Error en la respuesta del servidor:', response.status, response.statusText);
        throw new Error(`Error ${response.status}: No se pudo cargar imagen`);
      }
      
      const blob = await response.blob();
      
      // Verificar que el blob no esté vacío y sea una imagen
      if (blob.size === 0) {
        throw new Error("Imagen vacía o corrupta");
      }

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('Imagen cargada exitosamente:', imageUrl);
          resolve(reader.result);
        };
        reader.onerror = () => {
          console.error('Error al leer el blob de la imagen:', imageUrl);
          reject(new Error("Error al procesar imagen"));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
      // En caso de cualquier error, devolver la imagen por defecto
      return await getFallbackImage();
    }
  }

  // Función mejorada para obtener la imagen de respaldo
  async function getFallbackImage() {
    try {
      const fallbackUrl = "https://i.ibb.co/fY1sCQCV/sin-Imagen.png";
      console.log('Cargando imagen por defecto:', fallbackUrl);
      
      const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(fallbackUrl)}`);
      if (!response.ok) throw new Error("No se pudo cargar imagen de respaldo");
      
      const blob = await response.blob();
      
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Error al leer imagen de respaldo"));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error al cargar la imagen de respaldo:", error);
      // Si incluso la imagen de respaldo falla, devolver null
      return null;
    }
  }

  async function generarBoletin() {
    setGenerando(true);
    setErrorGen(null);

    try {
      // Usar directamente las noticias que recibe el hook (por ejemplo, desde useNews
      if (!Array.isArray(noticias)) {
        throw new Error("No hay noticias disponibles para generar el boletín");
      }

      const noticiasAprobadas = noticias.filter((n) => {
        if (!n?.estado) return false;
        const estado = String(n.estado).toLowerCase();
        return estado === "aprobada" || estado === "aprobado";
      });

      if (noticiasAprobadas.length === 0) {
        setErrorGen("No hay noticias aprobadas para generar el boletín.");
        setGenerando(false);
        return;
      }

      // Array para rastrear noticias descartadas por errores
      const noticiasDescartadas = [];

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let y = margin;

      // ====== FRANJAS DE COLOR EN CABECERA ======
      const franja1Height = 8; // Primera franja más gruesa (azul)
      const franja2Height = 16;  // Segunda franja más delgada (roja)
      
      // Asegurarse de que no hay margen superior para las franjas
      y = 0;
      
      // Primera franja: #05DBF2 (azul) - más gruesa
      doc.setFillColor(5, 219, 242); // #05DBF2
      doc.rect(0, y, pageWidth, franja1Height, "F");
      
      // Segunda franja: #F20C36 (rojo) - más delgada
      doc.setFillColor(242, 12, 54); // #F20C36
      doc.rect(0, y + franja1Height, pageWidth, franja2Height, "F");
      
      // Ajustar posición Y después de las franjas
      y = (franja1Height + franja2Height) + 20; // Espacio adicional después de las franjas

      // Cargar el logo de Mamen Noticias con manejo de errores
      let logoMamen = null;
      try {
        logoMamen = await getBase64ImageFromUrl("https://i.ibb.co/VpJkJfKx/logo-Mamen-Noticias-1.png");
      } catch (error) {
        console.error("Error cargando logo Mamen Noticias:", error);
        // Continuar sin logo si hay error
      }

      // Configuración del logo - más alto y menos ancho
      const logoWidth = 130; // Reducir el ancho
      const logoHeight = 70; // Aumentar la altura
      const logoY = y;
      const logoX = (pageWidth - logoWidth) / 2; // Centrar el logo horizontalmente

      // Agregar logo Mamen Noticias (centrado) si se cargó correctamente
      if (logoMamen) {
        doc.addImage(
          logoMamen,
          "PNG",
          logoX,
          logoY,
          logoWidth,
          logoHeight
        );
      }

      // Fecha y hora centradas más abajo
      const fechaHora = new Date().toLocaleString("es-ES", {
        dateStyle: "full",
        timeStyle: "short",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor("#6c757d");
      doc.text(fechaHora, pageWidth / 2, logoY + logoHeight + 15, { align: "center" });

      // Calcular la altura total del encabezado
      const headerHeight = logoY + logoHeight + 10; // Ajustar el espacio después del logo y fecha
      y = headerHeight + 25; // Actualizar la posición Y para el contenido principal

      // Primera página: máximo 2 noticias (en modo compacto para que quepan mejor)
      let noticiasEnPrimeraPagina = Math.min(noticiasAprobadas.length, 2);
      let noticiasRestantes = noticiasAprobadas.length - noticiasEnPrimeraPagina;

      // Procesar primera página (hasta 2 noticias en modo compacto)
      let noticiasProcesamientoExitoso = 0;
      for (let i = 0; i < noticiasEnPrimeraPagina; i++) {
        const noticia = noticiasAprobadas[i];
        try {
          // Si estamos demasiado cerca del final de la página, saltar a una nueva
          // Usamos un margen algo más laxo para intentar meter 2 en la primera hoja
          if (y > pageHeight - 280) {
            doc.addPage();
            y = margin;
          }
          // Primera página en modo compacto para que las cajas sean más bajas
          y = await agregarNoticiaAPDF(doc, noticia, y, pageWidth, margin, true);

          noticiasProcesamientoExitoso++;
        } catch (error) {
          console.error(`Error procesando noticia ID ${noticia.id || 'desconocido'}: ${noticia.titulo || 'Sin título'}`, error);
          noticiasDescartadas.push({
            id: noticia.id || 'desconocido',
            titulo: noticia.titulo || 'Sin título',
            error: error.message
          });
        }
      }

      // Si hay más noticias, crear nuevas páginas con 3 noticias cada una
      if (noticiasRestantes > 0) {
        doc.addPage();
        y = margin;
        let noticiasEnPagina = 0;

        for (let i = noticiasEnPrimeraPagina; i < noticiasAprobadas.length; i++) {
          const noticia = noticiasAprobadas[i];

          try {
            // Si ya hay 3 noticias en la página o estamos cerca del final, crear nueva página
            if (noticiasEnPagina === 3 || y > pageHeight - 320) {
              doc.addPage();
              y = margin;
              noticiasEnPagina = 0;
            }

            y = await agregarNoticiaAPDF(doc, noticia, y, pageWidth, margin, true);
            noticiasEnPagina++;
            noticiasProcesamientoExitoso++;
          } catch (error) {
            console.error(`Error procesando noticia ID ${noticia.id || 'desconocido'}: ${noticia.titulo || 'Sin título'}`, error);
            noticiasDescartadas.push({
              id: noticia.id || 'desconocido',
              titulo: noticia.titulo || 'Sin título',
              error: error.message
            });
          }
        }
      }

      // Nombre del archivo PDF
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const fechaActual = new Date();
      const dia = fechaActual.getDate();
      const sufijo = dia === 1 ? "ro" : "";
      const mes = meses[fechaActual.getMonth()];
      const nombrePDF = `MamenNoticias-${dia}${sufijo} de ${mes}`;

      // Verificar si se procesó al menos una noticia
      if (noticiasProcesamientoExitoso === 0) {
        throw new Error("No se pudo procesar ninguna noticia para el PDF");
      }

      // Si hay noticias descartadas, mostrar modal antes de descargar
      if (noticiasDescartadas.length > 0) {
        console.warn(`Se descartaron ${noticiasDescartadas.length} noticias por errores:`, noticiasDescartadas);
        setNoticiasDescartadas(noticiasDescartadas);
        setPdfPendiente({ doc, nombrePDF });
        setMostrarModal(true);
      } else {
        // Si no hay noticias descartadas, descargar directamente
        doc.save(`${nombrePDF}.pdf`);
      }
    } catch (e) {
      console.error(e);
      setErrorGen("Error generando PDF: " + e.message);
    } finally {
      setGenerando(false);
    }
  }

  async function agregarNoticiaAPDF(doc, noticia, y, pageWidth, margin, isCompact = false) {
    // Validaciones básicas
    if (!noticia) {
      throw new Error("Noticia es null o undefined");
    }
    
    if (!noticia.titulo || typeof noticia.titulo !== 'string') {
      throw new Error("Noticia no tiene título válido");
    }

    const boxWidth = pageWidth - margin * 2;
    const padding = 15;
    let cursorY = y + padding;

    // Estilo de la caja
    doc.setDrawColor("#e0e0e0");
    doc.setFillColor("#ffffff");
    doc.setLineWidth(1);

    // Metadatos con manejo seguro de fecha
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#000000");
    
    let fechaPub = "Fecha no disponible";
    try {
      if (noticia.fecha_publicacion) {
        const fecha = new Date(noticia.fecha_publicacion);
        if (!isNaN(fecha.getTime())) {
          fechaPub = fecha.toLocaleDateString();
        }
      }
    } catch (error) {
      console.warn("Error procesando fecha de publicación:", error);
    }
    
    const metaText = `${fechaPub} | Autor: ${noticia.autor || "Desconocido"}`;
    doc.text(metaText, margin + padding, cursorY);
    cursorY += 18;

    // Título con validación - CAMBIO DE COLOR AQUÍ
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor("#F20C36"); // Cambiado de "#12358d" a "#F20C36" (skyblue)
    
    let tituloSeguro = noticia.titulo.trim();
    if (tituloSeguro.length > 200) {
      tituloSeguro = tituloSeguro.substring(0, 197) + "...";
    }
    
    const titleLines = doc.splitTextToSize(tituloSeguro, boxWidth - padding * 2);
    doc.text(titleLines, margin + padding, cursorY);
    cursorY += titleLines.length * 18;

    // MEJORA PRINCIPAL: Manejo robusto de imágenes
    let imagenProcesada = false;
    let alturaImagen = 0;

    // Siempre intentar cargar una imagen (ya sea la original o la por defecto)
    try {
      let imagenUrl = noticia.imagen;
      
      // Validar URL de imagen
      const isValidImageUrl = imagenUrl && 
                            typeof imagenUrl === 'string' && 
                            imagenUrl.trim() !== '' && 
                            (imagenUrl.startsWith('http://') || imagenUrl.startsWith('https://'));
      
      // Si la URL no es válida, usar imagen por defecto
      if (!isValidImageUrl) {
        console.log(`URL de imagen inválida para noticia ${noticia.id}, usando imagen por defecto`);
        imagenUrl = "https://i.ibb.co/fY1sCQCV/sin-Imagen.png";
      }

      const imgData = await getBase64ImageFromUrl(imagenUrl);
      
      if (imgData) {
        // Deja solo un pequeño margen a los lados
        const sideMargin = 12;
        const maxImgWidth = boxWidth - sideMargin * 2;
        
        // Crear elemento imagen para obtener dimensiones
        const imgObj = new Image();
        imgObj.src = imgData;
        
        await new Promise((resolve, reject) => {
          imgObj.onload = () => {
            try {
              // Calcular dimensiones manteniendo la relación de aspecto
              const imgAspectRatio = imgObj.width / imgObj.height;
              let imgWidth = maxImgWidth;
              let imgHeight = imgWidth / imgAspectRatio;
              
              // Si la imagen es muy alta, limitar su altura
              const maxImgHeight = isCompact ? 120 : 200;
              if (imgHeight > maxImgHeight) {
                imgHeight = maxImgHeight;
                imgWidth = imgHeight * imgAspectRatio;
              }
              
              // Asegurarse de que la imagen no sea más ancha que el máximo permitido
              if (imgWidth > maxImgWidth) {
                imgWidth = maxImgWidth;
                imgHeight = imgWidth / imgAspectRatio;
              }
              
              // Calcular posición X para centrar la imagen
              const imgX = (pageWidth - imgWidth) / 2;
              
              // Agregar espacio antes de la imagen
              cursorY += 5;
              
              // Marco para la imagen (sutil sombra)
              doc.setFillColor("#f8fafc");
              doc.roundedRect(
                imgX - 4,
                cursorY - 4,
                imgWidth + 8,
                imgHeight + 8,
                8,
                8,
                "F"
              );
              
              // Agregar la imagen al PDF
              doc.addImage(
                imgData,
                'JPEG',
                imgX,
                cursorY,
                imgWidth,
                imgHeight
              );
              
              // Actualizar la posición Y después de la imagen
              alturaImagen = imgHeight + 18;
              cursorY += alturaImagen;
              imagenProcesada = true;
              resolve();
            } catch (error) {
              console.error("Error al agregar imagen al PDF:", error);
              resolve(); // Continuar sin la imagen
            }
          };
          imgObj.onerror = () => {
            console.error("Error al cargar imagen para dimensiones");
            resolve(); // Continuar sin la imagen
          };
          // Timeout para evitar esperas infinitas
          setTimeout(resolve, 3000);
        });
      }
    } catch (error) {
      console.warn(`Error procesando imagen para noticia ${noticia.id || 'desconocido'}:`, error);
      // Continuar sin imagen - la imagen por defecto ya debería haberse cargado
    }

    // Resumen (limitado para evitar solapamiento) con validación
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor("#000000");
    
    let resumenMostrar = "";
    try {
      resumenMostrar = noticia.resumen_ia || noticia.resumen || "Sin resumen disponible";
      if (typeof resumenMostrar !== 'string') {
        resumenMostrar = String(resumenMostrar);
      }
      // Limpiar caracteres problemáticos
      resumenMostrar = resumenMostrar.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
    } catch (error) {
      console.warn("Error procesando resumen:", error);
      resumenMostrar = "Error procesando resumen";
    }
    
    let resumenLines = doc.splitTextToSize(resumenMostrar, boxWidth - padding * 2);
    // Ajustar número de líneas según si tiene imagen o no (ligeramente menos para compactar)
    const maxResumenLines = imagenProcesada ? 4 : 7;

    if (resumenLines.length > maxResumenLines) {
      resumenLines = resumenLines.slice(0, maxResumenLines);
      resumenLines[maxResumenLines - 1] += " ...";
    }
    doc.text(resumenLines, margin + padding, cursorY);
    cursorY += resumenLines.length * (isCompact ? 12 : 14);

    // Leer más con validación de URL
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor("#05DBF2");
    
    let urlSegura = "#";
    try {
      if (noticia.url && typeof noticia.url === 'string' && noticia.url.trim()) {
        urlSegura = noticia.url.trim();
      }
    } catch (error) {
      console.warn("Error procesando URL:", error);
    }
    
    doc.textWithLink("Leer más", margin + padding, cursorY, {
      url: urlSegura,
    });
    cursorY += 20;

    // Calcular altura de la caja dinámicamente según el contenido
    let boxHeightReal;
    if (isCompact) {
      // Para modo compacto (primera página), un poco más alto para que la noticia se vea más grande
      boxHeightReal = imagenProcesada ? 290 : 205;
    } else {
      // Para modo normal, usar altura real del contenido
      boxHeightReal = cursorY - y + padding;
    }
    
    doc.setDrawColor("#e0e0e0"); // gris claro
    doc.setLineWidth(1.2);
    doc.roundedRect(margin, y, boxWidth, boxHeightReal, 12, 12, "S");

    // Espaciado después de la caja, reducido para que quepan mejor varias noticias
    const espaciadoDespues = imagenProcesada ? (isCompact ? 4 : 14) : (isCompact ? 2 : 10);

    return y + boxHeightReal + espaciadoDespues;
  }

  const confirmarYDescargar = () => {
    if (pdfPendiente) {
      pdfPendiente.doc.save(`${pdfPendiente.nombrePDF}.pdf`);
      setPdfPendiente(null);
    }
    setMostrarModal(false);
    setNoticiasDescartadas([]);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNoticiasDescartadas([]);
    setPdfPendiente(null);
  };

  return { 
    generarBoletin, 
    generando, 
    errorGen, 
    noticiasDescartadas,
    mostrarModal,
    confirmarYDescargar,
    cerrarModal
  };
}