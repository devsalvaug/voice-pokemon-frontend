// src/lib/llmClient.js
export async function askLLM(messages) {
  const r = await fetch("http://localhost:3001/api/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!r.ok) throw new Error("Error en LLM");
  return (await r.json()).text;
}
