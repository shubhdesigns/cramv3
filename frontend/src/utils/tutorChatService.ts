/**
 * Calls backend (Cloud Function) to get Gemini/generative LLM answer.
 * Expects a deployed endpoint: /api/tutorChat (maps to backend via Firebase Functions).
 */
export async function askTutor(messages: { role: string; text: string }[]): Promise<string> {
  // POST to API endpoint; you may want to include auth token in production
  try {
    const res = await fetch("/api/tutorChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    return data.answer || "No answer provided.";
  } catch {
    return "There was an error contacting the tutor.";
  }
}