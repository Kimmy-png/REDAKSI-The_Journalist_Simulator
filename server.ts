import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Game AI
  app.post("/api/game-ai", async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing on server" });
    }

    const { request, systemPrompt } = req.body;
    console.log(`[AI Request] Type: ${request?.request_type}`);

    try {
      let attempts = 0;
      const maxAttempts = 3;
      let lastError: any;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({ 
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: JSON.stringify(request) }] }],
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: "application/json",
            }
          });

          const text = response.text;
          console.log(`[AI Response] Length: ${text?.length || 0}`);
          if (!text) {
            throw new Error("Empty response from AI");
          }
          return res.json(JSON.parse(text));
        } catch (error: any) {
          lastError = error;
          const isRateLimit = error.message?.includes("429") || error.message?.includes("QUOTA_EXCEEDED");
          const isOverloaded = error.message?.includes("503") || error.message?.includes("high demand") || error.message?.includes("UNAVAILABLE");

          if (isRateLimit || isOverloaded) {
            attempts++;
            if (attempts < maxAttempts) {
              const delay = Math.pow(2, attempts) * 1000;
              console.log(`AI busy (503/429). Attempt ${attempts}/${maxAttempts}. Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
          }
          throw error;
        }
      }
      throw lastError;
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
