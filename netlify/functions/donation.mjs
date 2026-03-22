export default async (req, context) => {
  try {
    const res = await fetch("https://www.donably.com/polgari-ellenallas");
    const html = await res.text();

    // Parse donation amount - look for the large number before "HUF"
    const amountMatch = html.match(/([\d\s]{5,})\s*(?:<[^>]*>\s*)*HUF/i)
      || html.match(/([\d]{1,3}(?:[\s\xa0]\d{3}){2,})/);

    // Parse supporter count
    const supporterMatch = html.match(/([\d\s]+)\s*(?:<[^>]*>\s*)*supporter/i);

    let amount = null;
    let supporters = null;

    if (amountMatch) {
      amount = amountMatch[1].replace(/\s+/g, ' ').trim();
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
