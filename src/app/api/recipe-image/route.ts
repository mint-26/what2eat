import { NextResponse } from "next/server";

// Pexels API proxy – searches for a recipe-matching food photo.
// Requires PEXELS_API_KEY env var.
// Docs: https://www.pexels.com/api/documentation/

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      // Graceful fallback — client will use its own placeholder
      return NextResponse.json({ imageUrl: null });
    }

    // Improve relevance: append "food" and use German→English translation hints
    const searchQuery = `${query} food dish`;

    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        searchQuery
      )}&per_page=5&orientation=landscape`,
      {
        headers: { Authorization: apiKey },
        // Cache at the edge for 24h since food photos don't change
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ imageUrl: null });
    }

    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) {
      return NextResponse.json({ imageUrl: null });
    }

    // Prefer medium size (~800px wide), fall back to large
    const imageUrl =
      photo.src?.large ?? photo.src?.medium ?? photo.src?.original ?? null;

    return NextResponse.json({
      imageUrl,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
    });
  } catch (err) {
    console.error("[recipe-image] error:", err);
    return NextResponse.json({ imageUrl: null });
  }
}
