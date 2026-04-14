import { NextRequest, NextResponse } from "next/server";
import { buildImagePrompt } from "@/lib/suggestions";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ imageUrl: null, error: "OPENROUTER_API_KEY not configured" }, { status: 200 });
  }

  const { mealName, mainIngredients = [] } = (await req.json()) as {
    mealName: string;
    mainIngredients: string[];
  };

  const prompt = buildImagePrompt(mealName, mainIngredients);

  try {
    // Use Stable Diffusion XL via OpenRouter for image generation
    const response = await fetch("https://openrouter.ai/api/v1/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://what2eat.app",
        "X-Title": "what2eat",
      },
      body: JSON.stringify({
        model: "stability-ai/stable-diffusion-xl-base-1.0",
        prompt,
        width: 512,
        height: 512,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter image generation error:", err);
      return NextResponse.json({ imageUrl: null }, { status: 200 });
    }

    const data = await response.json();

    // OpenRouter image generation returns: { id, model, choices: [{ finish_reason, native_finish_reason, message: { content: [{ type: 'image_url', image_url: { url } }] } }] }
    const content = data.choices?.[0]?.message?.content;
    let imageUrl: string | null = null;

    if (Array.isArray(content)) {
      const imgPart = content.find((c: { type: string }) => c.type === "image_url");
      imageUrl = imgPart?.image_url?.url ?? null;
    } else if (typeof content === "string" && content.startsWith("data:image")) {
      imageUrl = content;
    } else if (data.artifacts?.[0]?.base64) {
      imageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error("Image generation error:", err);
    return NextResponse.json({ imageUrl: null }, { status: 200 });
  }
}
