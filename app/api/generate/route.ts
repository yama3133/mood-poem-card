import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

const MOTIFS = ["flower", "wave", "mountain", "star", "leaf", "moon", "rain", "cloud"] as const;

const SYSTEM_PROMPT = `You are a poet and visual designer. Given a mood or theme from the user, respond with ONLY a JSON object (no markdown fences, no commentary) with this exact shape:
{
  "title": "short poem title, 2-6 words",
  "lines": ["line1", "line2", "line3", "line4"],
  "colors": ["#hex1", "#hex2", "#hex3"],
  "motif": "one of: ${MOTIFS.join(", ")}"
}
The poem must be 4 short lines, evocative and original, matching the requested language. Colors must be 3 hex codes forming a harmonious palette that visually matches the mood. Pick the motif that best fits the poem's imagery.`;

export async function POST(req: NextRequest) {
  try {
    const { theme, lang } = await req.json();
    if (!theme || typeof theme !== "string" || theme.length > 200) {
      return NextResponse.json({ error: "invalid theme" }, { status: 400 });
    }

    const langInstruction = lang === "en" ? "Write the poem in English." : "詩は日本語で書いてください。";

    const command = new ConverseCommand({
      modelId: "amazon.nova-pro-v1:0",
      system: [{ text: SYSTEM_PROMPT }],
      messages: [
        {
          role: "user",
          content: [{ text: `Theme/mood: "${theme}". ${langInstruction}` }],
        },
      ],
      inferenceConfig: { maxTokens: 500, temperature: 0.9 },
    });

    const response = await client.send(command);
    const text = response.output?.message?.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "generation failed" }, { status: 502 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed.lines) || !Array.isArray(parsed.colors) || !MOTIFS.includes(parsed.motif)) {
      return NextResponse.json({ error: "malformed generation" }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
