import { NextRequest, NextResponse } from "next/server";
import { buildSuggestionPrompt } from "@/lib/suggestions";
import type { UserRole } from "@/types/database";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const { role, recentMeals = [], partnerHints = [] } = (await req.json()) as {
    role: UserRole;
    recentMeals?: { meal_name: string; date_cooked: string; rating_adrian?: number; rating_janina?: number }[];
    partnerHints?: string[];
  };

  if (role !== "adrian" && role !== "janina") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const prompt = buildSuggestionPrompt(role, recentMeals as any, partnerHints);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Claude API error:", err);
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 502 });
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    return NextResponse.json(suggestions);
  } catch (err) {
    console.error("Suggestion generation error:", err);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
