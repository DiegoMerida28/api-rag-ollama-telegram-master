const { ChatOllama } = require('@langchain/ollama');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

class RagAdapter {
    constructor() {
        this.model = new ChatOllama({
            baseUrl: OLLAMA_URL,
            model: OLLAMA_MODEL,
            temperature: 0.1,
        });

        this.prompt = ChatPromptTemplate.fromMessages([
            ['system',
                'Eres el asistente de precios de una tienda. Responde SIEMPRE en español, en una sola frase breve.\n' +
                '- Si el CONTEXTO tiene un producto que corresponde a la pregunta, responde con su precio, ' +
                'en este formato exacto: "El precio de <producto> es $<precio>.00".\n' +
                '- Si el CONTEXTO está vacío, responde EXACTAMENTE: "No está en existencia."\n' +
                'No inventes productos ni precios que no aparezcan en el CONTEXTO.'],
            ['human', 'CONTEXTO:\n{contexto}\n\nPREGUNTA: {pregunta}'],
        ]);

        this.chain = this.prompt.pipe(this.model).pipe(new StringOutputParser());
    }

    async generarRespuesta(pregunta, contexto) {
        return this.chain.invoke({ pregunta, contexto: contexto || '(vacío)' });
    }
}

module.exports = RagAdapter;
