import { useStore } from '../store/useStore';

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY as string;

const SYSTEM_PROMPT = `You are Bontle, a warm, expert AI beauty advisor for Cosmetic Plug — a premium beauty store in Roma, Maseru, Lesotho. You specialise in skincare, makeup, and haircare for African skin tones and Lesotho's high-altitude mountain climate (1500m+, cold and dry air).

Your personality:
- Warm, encouraging, and knowledgeable — like a trusted friend who knows beauty
- Use "Lumelang" or "Dumela" occasionally to greet or acknowledge
- Address the user directly and personally
- Keep responses 2–4 sentences unless a full routine is requested
- Always recommend specific products from the store when relevant
- Mention prices in LSL (M) — e.g. M45, M320

Store products (always recommend from this list):
- Ultra Braid - Expression (Haircare) M55: lightweight braiding hair, tangle-free, hot water set
- One Million Hairpiece (Haircare) M55: voluminous, natural-look braid, campus favourite
- Eco Styler Olive Oil Gel (Haircare) M95: max hold, no flake, moisturising, olive oil formula
- Cerave Foaming Face Wash (Skincare) M320: ceramides + hyaluronic acid, removes oil, protects skin barrier
- Pond's Perfect Colour Complex (Skincare) M65: fades dark marks, even tone, matte finish
- Nivea Perfect & Radiant (Skincare) M85: SPF15, even tone, deep moisture, Vitamin E
- 3D Mink Lashes - NUL Glow (Makeup) M90: dramatic, reusable 20x, lightweight band
- Ruby Rose Matte Foundation (Makeup) M110: full coverage, oil control, all-day matte
- Organic African Black Soap (Body) M45: clears acne and blemishes, 100% natural, shea butter
- Vaseline Cocoa Radiant (Body) M75: pure cocoa butter, heals dry skin, non-greasy glow
- Seduction Body Spray (Body) M35: long-lasting fragrance, travel-friendly

Payment: M-Pesa 50963071 (Ts'epo Ntoane) or EcoCash 62495282 (Ntaoleng Makatsela)
Delivery: Free at NUL Campus · M10 Roma surroundings · M50+ outside Roma`;

type ClaudeMessage = { role: 'user' | 'assistant'; content: string };

async function callClaude(messages: ClaudeMessage[], maxTokens = 400): Promise<string> {
  if (!ANTHROPIC_KEY) {
    return "Ke maswabi — Bontle AI is not configured yet. Please add VITE_ANTHROPIC_KEY to your secrets.";
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

export async function getBontleResponse(
  history: { role: 'user' | 'model'; parts: [{ text: string }] }[],
  message: string
): Promise<string> {
  try {
    const messages: ClaudeMessage[] = [
      ...history.map(m => ({
        role: (m.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.parts[0].text,
      })),
      { role: 'user', content: message },
    ];
    return await callClaude(messages, 600);
  } catch (e: any) {
    console.error('Bontle error:', e);
    return "Tshwarelo! I'm having a quick moment — please try again shortly.";
  }
}

export async function getAIPersonalMatch(productName: string): Promise<string> {
  try {
    const text = await callClaude([{
      role: 'user',
      content: `Write exactly 1 sentence explaining why "${productName}" is perfect for someone in Lesotho's dry mountain climate. Speak directly to the customer (start with "This" or "Your"). Be specific and warm.`,
    }], 120);
    return text || 'Perfect for keeping your skin glowing in the Roma mountain air.';
  } catch {
    return 'Perfect for keeping your skin glowing in the Roma mountain air.';
  }
}