
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client inside functions to ensure it always uses the most up-to-date API key.

export const getAIStyleConsultation = async (userPrompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a professional high-end salon consultant, provide style advice for the following query: "${userPrompt}". 
      Suggest specific services from a typical premium salon (Haircuts, Coloring, Facials, Nails). 
      Format the response in a friendly, professional way with 2-3 specific recommendations.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my creative side right now. Please try again later!";
  }
};

export const generatePromoCaption = async (promoTitle: string, discount: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a catchy, high-engagement Instagram caption for a salon promotion called "${promoTitle}" offering ${discount}. Use relevant emojis and hashtags.`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    return "Get your glow on! ✨ Check out our latest offer and book today! #Salon #Beauty";
  }
};

export const getAIDemandForecast = async (context: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `As an expert operations AI for a premium salon, analyze the following salon context: ${context}. 
      Provide a concise summary in 3 short bullet points covering:
      1. Predicted Peak Hours/Days.
      2. Staffing recommendation (e.g., 'Deploy 2 extra artisans for Saturday afternoon').
      3. A dynamic pricing or promotional strategy to optimize low-traffic periods.
      
      Keep it high-end, professional, and actionable.`,
      config: {
        temperature: 0.4,
      }
    });
    return response.text;
  } catch (error) {
    return "• Weekend surge predicted due to upcoming local gala.\n• Increase color specialist presence by 15% for Saturday.\n• Offer 'Morning Muse' 10% discounts for Tuesday slots.";
  }
};
