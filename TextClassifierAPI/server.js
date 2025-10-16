import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { z } from "zod";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Zod-схема для проверки ответа GPT ---
const responseSchema = z.object({
  zip: z.string().nullable(),
  brand: z.string().nullable(),
  category: z.string().nullable(),
  time_pref: z.string().nullable()
});

// --- GPT-классификация с проверкой ---
async function classifyText(text) {
  const prompt = `
Ты — парсер пользовательских запросов.
Верни JSON формата:
{
  "zip": string | null,
  "brand": string | null,
  "category": string | null,
  "time_pref": string | null
}
Текст: "${text}"
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    response_format: { type: "json_object" }
  });

  const content = response.choices?.[0]?.message?.content ?? response.choices?.[0]?.message;

  // --- Валидация через Zod ---
  try {
    return responseSchema.parse(JSON.parse(content));
  } catch (err) {
    throw new Error("Invalid GPT response: " + err);
  }
}

// --- Endpoint /classify ---
app.post("/classify", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const result = await classifyText(text);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Swagger ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Text Classifier API",
      version: "1.0.0",
      description: "API для конвертации текста в структурированный JSON (zip, brand, category, time_pref)"
    },
    servers: [{ url: "http://localhost:3000" }]
  },
  apis: ["./server.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /classify:
 *   post:
 *     summary: Классифицировать текст
 *     description: Возвращает JSON с полями zip, brand, category, time_pref
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Закажи пиццу из Domino's на завтра в 18:00, ZIP 90210"
 *     responses:
 *       200:
 *         description: Успешная классификация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zip:
 *                   type: string
 *                   nullable: true
 *                   example: "90210"
 *                 brand:
 *                   type: string
 *                   nullable: true
 *                   example: "Domino's"
 *                 category:
 *                   type: string
 *                   nullable: true
 *                   example: "pizza"
 *                 time_pref:
 *                   type: string
 *                   nullable: true
 *                   example: "2025-10-17T18:00:00Z"
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}\nSwagger: http://localhost:${PORT}/docs`));
