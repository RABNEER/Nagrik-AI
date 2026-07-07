// ============================================================================
// NagrikAI — Gemini (fallback to Groq) Client Wrapper
// ----------------------------------------------------------------------------
// Implements multi-model rate-limit and quota fallback logic. Tries Gemini models
// (2.5 Flash/Pro, 1.5 Flash/Pro) and falls back to Groq models (Llama 3.3, 3.1, Mixtral)
// if any API quota or rate limits are exceeded.
// IMPORTANT: server-side only — never import this in client components.
// ============================================================================

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768"
];

/**
 * Executes a call to LLM providers, trying Gemini models in sequence first,
 * and falling back to Groq if rate limits or quotas are exceeded.
 */
async function callLLM(
  systemPrompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userMessage: string,
  responseFormatJSON = false
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
    throw new Error("Missing both GEMINI_API_KEY and GROQ_API_KEY environment variables on server.");
  }

  // 1. Try Gemini models
  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[LLM] Trying Gemini model: ${model}`);
      
      const contents = [
        ...history.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ];

      const body: any = {
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      };

      if (responseFormatJSON) {
        body.generationConfig = {
          responseMimeType: "application/json"
        };
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          // Short timeout so we failover quickly if a model is hung or slow
          signal: AbortSignal.timeout(12000)
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.warn(`[LLM] Gemini ${model} failed with status ${res.status}:`, data);
        throw new Error(data?.error?.message || `HTTP ${res.status}`);
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`[LLM] Successful response from Gemini: ${model}`);
        return text;
      }
    } catch (err) {
      console.warn(`[LLM] Failover triggered: Gemini ${model} errored:`, err);
    }
  }

  // 2. Try Groq models as fallback
  for (const model of GROQ_MODELS) {
    try {
      console.log(`[LLM] Trying Groq fallback model: ${model}`);
      
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage }
      ];

      const body: any = {
        model,
        messages,
      };

      if (responseFormatJSON) {
        body.response_format = { type: "json_object" };
      }

      const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(12000)
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn(`[LLM] Groq ${model} failed with status ${res.status}:`, data);
        throw new Error(data?.error?.message || `HTTP ${res.status}`);
      }

      const text = data?.choices?.[0]?.message?.content;
      if (text) {
        console.log(`[LLM] Successful response from Groq fallback: ${model}`);
        return text;
      }
    } catch (err) {
      console.warn(`[LLM] Failover triggered: Groq ${model} errored:`, err);
    }
  }

  throw new Error("All LLM models and fallbacks failed to respond. Please check your API keys or network status.");
}

/**
 * Generate a chat completion given a system prompt + conversation history.
 * Returns the assistant's text response.
 */
export async function generateChat(
  systemPrompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<string> {
  return callLLM(systemPrompt, history, userMessage, false);
}

/**
 * Generate a completion and parse the result as JSON. Used by Scam Shield and
 * Grievance classification where a strict JSON schema is required.
 * Strips markdown code fences if present and extracts the JSON object.
 */
export async function generateJSON<T = unknown>(
  systemPrompt: string,
  userMessage: string
): Promise<T> {
  const raw = await callLLM(systemPrompt, [], userMessage, true);

  // Strip markdown code fences and extract the JSON object
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  // If there's still surrounding text, grab the outermost { ... }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned) as T;
}
