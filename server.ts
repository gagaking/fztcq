import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Init Gemini SDK
  let ai: GoogleGenAI | null = null;
  let globalDebugInfo = "";
  const getAi = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
         throw new Error("GEMINI_API_KEY is not defined");
      }
      globalDebugInfo = `Key: ${process.env.GEMINI_API_KEY.substring(0, 4)}... length=${process.env.GEMINI_API_KEY.length}`;
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return { ai, debugInfo: globalDebugInfo };
  };

  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLang = 'en' } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      // @ts-ignore
      const fetchResponse = await fetch(url);
      const data = await fetchResponse.json();
      
      const translatedText = data[0].map((item: any) => item[0]).join("");
      res.json({ translatedText });
    } catch (e: any) {
      console.error("Translation error:", e);
      res.status(500).json({ error: e.message || "Failed to translate" });
    }
  });

  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
      }

      const { ai: client, debugInfo } = getAi();
      
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: {
          // @ts-ignore
          imageConfig: {
            aspectRatio: '3:4'
          }
        }
      });

      let base64Image: string | undefined;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (base64Image) {
        res.json({ imageBytes: base64Image });
      } else {
        res.status(500).json({ error: "Failed to generate image", debugInfo });
      }
    } catch (e: any) {
      console.error("Generate error:", e);
      let debugInfo = "";
      try { debugInfo = getAi().debugInfo; } catch(err) {}
      res.status(500).json({ error: e.message || "Something went wrong", details: e, debugInfo });
    }
  });

  // Vite middleware for dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
