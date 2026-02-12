import { GoogleGenAI } from "@google/genai";
import { Student } from '../types';

/**
 * Analyzes academic risk using Gemini 3 Pro with reasoning (thinking) capabilities.
 */
export const analyzeAcademicRisk = async (students: Student[]): Promise<string> => {
  // Always initialize GoogleGenAI inside functions to ensure the latest API key from context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const highRiskStudents = students.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium');
  
  const prompt = `
    Analyze the following student data. Identify key patterns leading to High/Medium risk levels. 
    Provide specific, actionable recommendations for academic intervention.
    
    Data: ${JSON.stringify(highRiskStudents)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Complex reasoning task
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }, // Allocate thinking budget for detailed analysis
        maxOutputTokens: 2048,
      }
    });
    // Extract text output using the .text property directly
    return response.text || "Unable to generate analysis.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating academic analysis. Please check your API key.";
  }
};

/**
 * Chat with ScholarBot. Uses Google Maps grounding which requires a Gemini 2.5 series model.
 */
export const chatWithGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const chat = ai.chats.create({
      // Switch to gemini-2.5-flash for compatibility with Google Maps grounding
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: "You are ScholarBot, an intelligent assistant for a university app. You help with academic advice, bus schedules, and general queries. Be concise, professional, and helpful.",
        tools: [{googleMaps: {}}], // Maps grounding enabled
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm not sure how to answer that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to the network right now.";
  }
};

/**
 * Service to find bus stops or location info using Maps grounding.
 */
export const findBusStops = async (query: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{googleMaps: {}}],
            }
        });
        return response.text || "Could not find location info.";
    } catch (e) {
        console.error("Gemini Location Error:", e);
        return "Location service unavailable.";
    }
}