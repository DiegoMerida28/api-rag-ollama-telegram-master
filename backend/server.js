const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ProductoRepositoryAdapter = require('./src/infrastructure/productoRepositoryAdapter');
const RagAdapter = require('./src/infrastructure/ragAdapter');
const RagService = require('./src/application/ragService');
const RagController = require('./src/interfaces/ragController');
const iniciarTelegramBot = require('./src/infrastructure/telegramBotAdapter');

const app = express();
app.use(cors());
app.use(express.json());

const productoRepository = new ProductoRepositoryAdapter();
const ragAdapter = new RagAdapter();
const ragService = new RagService(productoRepository, ragAdapter);
const ragController = new RagController(ragService);

app.post('/consulta', (req, res) => ragController.consultar(req, res));

app.get('/', (req, res) => {
  res.status(200).json({ mensaje: 'Agente RAG de precios con LangChain, Ollama y Telegram' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  iniciarTelegramBot(ragService);
});
