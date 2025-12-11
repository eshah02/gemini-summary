import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// POST
export async function POST(request) {
  
  if (!genAI) {
    return NextResponse.json(
      { message: "Gemini API Key missing." },
      { status: 500 }
    );
  }

  try {
    const { title, description = "" } = await request.json();

    const prompt = `Generate a concise, one-sentence summary for this task.
    Title: "${title}"
    Details: "${description}"
    Focus on main action only.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    return NextResponse.json({ summary }, { status: 200 });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { message: `Error from Gemini API: ${error.message}` },
      { status: 500 }
    );
  }
}
