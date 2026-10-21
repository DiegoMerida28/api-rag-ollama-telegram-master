const STOPWORDS = new Set([
    'cuanto', 'cuánto', 'cuesta', 'cuestan', 'precio', 'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una',
    'hay', 'tienes', 'tienen', 'tiene', 'existe', 'existen', 'disponible', 'cual', 'cuál', 'es', 'para',
    'por', 'con', 'en', 'me', 'puedes', 'decir', 'dime', 'sobre', 'que', 'qué', 'costo', 'vale', 'valen', 'y',
]);

class RagService {
    constructor(productoRepository, ragAdapter) {
        this.productoRepository = productoRepository;
        this.ragAdapter = ragAdapter;
    }

    extraerPalabrasClave(texto) {
        return texto
            .toLowerCase()
            .replace(/[¿?¡!.,;:]/g, '')
            .split(/\s+/)
            .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    }

    async responder(pregunta) {
        const palabras = this.extraerPalabrasClave(pregunta);
        const productos = await this.productoRepository.buscarPorPalabras(palabras);
        const contexto = productos
            .map((p) => `${p.nombre}: $${Number(p.precio).toFixed(2)}`)
            .join('\n');
        const respuesta = await this.ragAdapter.generarRespuesta(pregunta, contexto);
        return { respuesta: respuesta.trim(), productos_encontrados: productos };
    }
}

module.exports = RagService;
