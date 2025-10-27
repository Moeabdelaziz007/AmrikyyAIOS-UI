import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateResponse = async (prompt: string, history: Content[]): Promise<string> => {
  if (!API_KEY) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "This is a simulated response. To connect to Gemini, please provide an API key. I am Maya, ready to assist with your travel intelligence needs.";
  }

  try {
    const contents: Content[] = [...history, { role: 'user', parts: [{ text: prompt }] }];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: contents,
      config: {
        systemInstruction: "You are Maya, a helpful AI assistant for the Amrikyy AI OS, specializing in travel intelligence. Be friendly, helpful, and concise.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while contacting the AI: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI.";
  }
};