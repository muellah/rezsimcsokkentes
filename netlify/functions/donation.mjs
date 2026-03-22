export default async (req, context) => {
  try {
    const res = await fetch("https://www.donably.com/polgari-ellenallas");
    const html = await res.text();

    // Donably uses: <div class="fanpage-donators h3">35 448 600 <span>HUF</span></div>
    const amountMatch = html.match(/fanpage-donators[^>]*>([\d\s]+)<\s*span[^>]*>\s*HUF/i);
    const supporterMatch = html.match(/fanpage-donators[^>]*>([\d\s]+)<\s*span[^>]*>\s*supporter/i);

    let amount = null;
    let supporters = null;

    if (amountMatch) {
      amount = amountMatch[1].trim();
    }
    if (supporterMatch) {
      supporters = supporterMatch[1].trim();
    }

    const data = {
      amount,
      supporters,
      currency: "HUF",
      goal: "45000000",
      updated: new Date().toISOString()
    };

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch donation data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/api/donation"
};
