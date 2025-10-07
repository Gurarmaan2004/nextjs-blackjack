// app/api/recommendation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  const { playerScore, dealerCard } = await req.json();

  if (playerScore == null || !dealerCard) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const prompt = `
You are a Blackjack advisor.
The player has a score of ${playerScore}, and the dealer is showing ${dealerCard}.
Based on basic Blackjack strategy, should the player "Hit" or "Stand"?
Respond only with the word: Hit or Stand followed by a very brief (<10 word) explanation.
`.trim();

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      apiVersion: 'v1',       // specify stable API version
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',   // choose a valid model name per Gemini docs :contentReference[oaicite:2]{index=2}
      contents: prompt,
    });
    if(response.text){
        const recommendation = response.text.trim(); // SDK returns `.text`
        return NextResponse.json({ recommendation });
    }

  } catch (err: any) {
    console.error("Gemini SDK error:", err);
    return NextResponse.json({ error: err.message || "Failed to get recommendation" }, { status: 500 });
  }
}
