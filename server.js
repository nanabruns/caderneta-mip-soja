// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: '*', // Permite que qualquer site (incluindo o seu do github.io) faça pedidos.
  methods: ['GET', 'POST', 'OPTIONS'], // Permite os métodos que precisamos.
  allowedHeaders: ['Content-Type', 'Authorization'] // Permite os cabeçalhos que enviamos.
}));
app.use(bodyParser.json());

// Pegando a chave da API do ambiente
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERRO: A chave da API Gemini não foi definida!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model:'gemini-1.0-pro' });

app.post("/analisar", async (req, res) => {
  try {
    const dados = req.body;

    // Você pode ajustar a forma como os dados são enviados
    const prompt = `
      Analise os seguintes dados da caderneta de campo e retorne um relatório, especificando as áreas analisadas geograficamente:
      ${JSON.stringify(dados)}
    `;

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    res.json({ texto: resposta });
  } catch (error) {
    console.error("Erro ao utilizar o Gemini:", error);
    res.status(500).json({ erro: "Falha na análise com a IA" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
