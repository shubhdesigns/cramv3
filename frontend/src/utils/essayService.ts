export async function scoreEssay(prompt: string, essay: string): Promise<{ score: number; feedback: string }> {
  const res = await fetch("/api/scoreEssay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, essay }),
  });
  if (!res.ok) throw new Error("Score request failed");
  const data = await res.json();
  return {
    score: data.score ?? 0,
    feedback: data.feedback ?? "No feedback received.",
  };
}