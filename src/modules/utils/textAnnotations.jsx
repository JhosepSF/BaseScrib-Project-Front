// textAnnotations.jsx — Utilidades seguras para anotación y visualización de correcciones de Writing

/**
 * Renderiza de forma segura el texto anotado por el docente, reemplazando etiquetas
 * <mark class="err-mark">...</mark> con elementos React estilizados en rojo para marcar errores.
 * No utiliza dangerouslySetInnerHTML para garantizar 100% seguridad contra XSS.
 *
 * @param {string} text - Texto que puede contener marcas HTML simples <mark>
 * @returns {Array<React.ReactNode>}
 */
export function renderAnnotatedText(text) {
  if (!text) return null;
  
  // Dividir por etiquetas <mark ...>...</mark>
  const parts = text.split(/(<mark[^>]*>[\s\S]*?<\/mark>)/i);
  
  return parts.map((part, idx) => {
    if (part.toLowerCase().startsWith("<mark")) {
      const inner = part.replace(/^<mark[^>]*>/i, "").replace(/<\/mark>$/i, "");
      return (
        <mark
          key={idx}
          className="student-err-mark"
          title="Error ortográfico o gramatical señalado por el profesor"
        >
          <span className="err-mark-badge">⚠️ Error</span>
          <span className="err-mark-text">{inner}</span>
        </mark>
      );
    }
    return part;
  });
}

/**
 * Remueve todas las etiquetas de marcas para obtener el texto puro.
 * @param {string} text
 * @returns {string}
 */
export function stripHtmlMarks(text) {
  if (!text) return "";
  return text.replace(/<mark[^>]*>/gi, "").replace(/<\/mark>/gi, "");
}
