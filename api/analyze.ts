const MODEL = "google/gemini-3.6-flash";
const MAX_IMAGE_CHARS = 5_500_000;

function send(res: any, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed." });
  const token = process.env.VERCEL_OIDC_TOKEN || process.env.AI_GATEWAY_API_KEY;
  if (!token) return send(res, 503, { error: "AI service is not configured yet. The deployment needs Vercel AI Gateway authentication." });

  const body = req.body || {};
  const type = body.type === "skin" ? "skin" : body.type === "hair" ? "hair" : null;
  const image = typeof body.image === "string" ? body.image : "";
  if (!type) return send(res, 400, { error: "Choose either a hair or skin scan." });
  if (!image.startsWith("data:image/jpeg;base64,") || image.length > MAX_IMAGE_CHARS) {
    return send(res, 400, { error: "Please take a new JPEG photo. The image must be under the size limit." });
  }

  const focus = type === "hair"
    ? "Assess only visible hair characteristics: apparent pattern (straight/wavy/curly/coily, if visible), visible shape and length, apparent strand grouping, frizz/definition, and styling opportunities. Do not claim to measure density, porosity, strand diameter, scalp condition, hair health or damage from one photo. Explain uncertainty."
    : "Assess only visible cosmetic surface details in the photographed skin area: visible shine, apparent dryness/flaking, visible texture or blemishes if clearly present, and image quality. Do not infer acne diagnosis, skin disease, age, ethnicity, identity, health, hormones, or medical causes. Do not rate attractiveness or rank appearance. Avoid judging skin tone.";

  const prompt = `You are AUREN, a careful cosmetic education assistant. Analyse this ${type} photo for practical, non-medical guidance.

${focus}

Rules:
- Describe only what is reasonably visible in this single image. If the area is unclear, say so.
- Be neutral and respectful. Never score beauty, attractiveness, facial features, or compare the person to ideals.
- Do not diagnose or recommend prescription medicines, supplements, or aggressive treatments.
- Give conservative, practical suggestions. Do not invent brands, product availability, prices, scientific citations, or measurements.
- Keep the language clear and concise.
- Return valid JSON only, using exactly this shape:
{
  "title": "short neutral title",
  "overview": "2 concise sentences about what the image can and cannot show",
  "observations": ["3-4 visible observations; include uncertainty"],
  "recommendations": ["3-4 practical, low-risk cosmetic next steps"],
  "limitations": ["2-3 important things this photo cannot establish"],
  "confidence": "low, moderate, or good"
}`;

  try {
    const gatewayResponse = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 950,
        response_format: { type: "json_object" },
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image, detail: "high" } }
          ]
        }]
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const data: any = await gatewayResponse.json().catch(() => ({}));
    if (!gatewayResponse.ok) {
      const status = gatewayResponse.status;
      if (status === 401) return send(res, 503, { error: "AI authentication is not active for this deployment yet." });
      if (status === 402 || status === 403) return send(res, 503, { error: "The AI service requires billing or account verification in Vercel AI Gateway before it can analyse photos." });
      if (status === 429) return send(res, 429, { error: "The AI service is busy. Please wait a moment and try again." });
      return send(res, 502, { error: "The AI provider could not complete the analysis. Please try again." });
    }

    const content = data?.choices?.[0]?.message?.content;
    const raw = typeof content === "string" ? content : Array.isArray(content) ? content.map((p: any) => p.text || "").join("") : "";
    const parsed = JSON.parse(raw);
    const analysis = {
      title: String(parsed.title || "Your visual guide").slice(0, 100),
      overview: String(parsed.overview || "").slice(0, 700),
      observations: Array.isArray(parsed.observations) ? parsed.observations.slice(0, 5).map((x: unknown) => String(x).slice(0, 350)) : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 5).map((x: unknown) => String(x).slice(0, 350)) : [],
      limitations: Array.isArray(parsed.limitations) ? parsed.limitations.slice(0, 4).map((x: unknown) => String(x).slice(0, 300)) : [],
      confidence: ["low", "moderate", "good"].includes(parsed.confidence) ? parsed.confidence : "low",
    };
    return send(res, 200, { analysis, model: MODEL });
  } catch (error) {
    return send(res, 502, { error: error instanceof Error && error.name === "TimeoutError" ? "The analysis took too long. Please try again." : "The AI service is temporarily unavailable." });
  }
}