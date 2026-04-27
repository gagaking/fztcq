import { GoogleGenAI } from "@google/genai";

async function run() {
  try {
     console.log("length: ", process.env.GEMINI_API_KEY?.length);
     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
     const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Hello"
     });
     console.log(response.text);
  } catch(e) {
     console.error(e);
  }
}
run();
