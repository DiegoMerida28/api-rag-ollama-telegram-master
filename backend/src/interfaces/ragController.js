class RagController {
    constructor(ragService) {
        this.ragService = ragService;
    }

    consultar = async (req, res) => {
        try {
            const { pregunta } = req.body;
            if (!pregunta || typeof pregunta !== 'string') {
                return res.status(400).json({ error: 'Debes enviar el campo "pregunta" como texto.' });
            }
            const resultado = await this.ragService.responder(pregunta);
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Error en /consulta:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}

module.exports = RagController;
