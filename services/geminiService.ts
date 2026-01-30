
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Summarizes a news article in Bangla using Gemini AI.
 */
export async function summarizeArticle(content: string): Promise<string> {
  if (!process.env.API_KEY) return "AI Summary requires an API Key.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `দয়া করে নিচের সংবাদের একটি সংক্ষিপ্ত সারমর্ম (৩-৪টি বাক্যে) বাংলা ভাষায় লিখুন:\n\n${content}`,
      config: {
        systemInstruction: "You are an expert Bangla journalist. Summarize news accurately and concisely.",
        temperature: 0.7,
      },
    });

    return response.text || "সারমর্ম তৈরি করা সম্ভব হয়নি।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "সারমর্ম লোড হতে সমস্যা হয়েছে।";
  }
}

/**
 * Generates an SEO-friendly headline for a given article content.
 */
export async function generateHeadline(content: string): Promise<string> {
  if (!process.env.API_KEY) return "No API Key found.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `নিচের সংবাদের জন্য একটি আকর্ষণীয় এবং ছোট শিরোনাম তৈরি করুন:\n\n${content}`,
      config: {
        systemInstruction: "You are an expert news editor. Create punchy, SEO-optimized headlines in Bangla.",
      },
    });

    return response.text?.trim() || "নতুন শিরোনাম";
  } catch (error) {
    console.error("Gemini Headline Error:", error);
    return "ত্রুটি ঘটেছে";
  }
}
