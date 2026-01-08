
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

// Fix: Use gemini-3-pro-preview for academic writing tasks and use process.env.API_KEY directly
export const initializeGeminiChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topK: 64,
      topP: 0.95,
      // Fix: Setting both maxOutputTokens and thinkingBudget together as recommended
      maxOutputTokens: 4096,
      thinkingConfig: { thinkingBudget: 1024 } 
    },
  });
  return chatSession;
};

// Fix: sendMessageStream correctly iterates over chunks and accesses .text property
export const sendMessageStream = async (message: string, onChunk: (text: string) => void) => {
  if (!chatSession) throw new Error("Chat session not initialized");

  try {
    const responseStream = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Fix: getAISuggestions uses ai.models.generateContent with the correct model and prompt structure
export const getAISuggestions = async (prompt: string, context: string): Promise<string> => {
  // Always initialize with process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Context: ${context}\n\nTask: ${prompt}`,
  });
  return response.text || "";
};

// Fix: generateSKKNStructure provides a structured outline using Type enum for the response schema
export const generateSKKNStructure = async (title: string, subject: string, grade: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Hãy tạo sườn nội dung cho sáng kiến kinh nghiệm:
      Tiêu đề: ${title}
      Môn: ${subject}
      Khối: ${grade}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          abstract: { 
            type: Type.STRING,
            description: "Tóm tắt sáng kiến"
          },
          situation: { 
            type: Type.STRING,
            description: "Thực trạng vấn đề"
          },
          solutions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Danh sách các giải pháp"
          },
          results: { 
            type: Type.STRING,
            description: "Kết quả đạt được"
          }
        },
        required: ["abstract", "situation", "solutions", "results"]
      }
    }
  });

  try {
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse structured AI response:", e);
    return null;
  }
};
