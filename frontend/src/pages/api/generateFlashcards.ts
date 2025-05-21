import type { APIRoute } from "astro";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../../utils/firebase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { topic } = await request.json();
    if (!topic) return new Response("Missing topic", { status: 400 });

    const functions = getFunctions(app);
    const generateFlashcards = httpsCallable(functions, "generateFlashcards");
    const result: any = await generateFlashcards({ topic });

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response("API error: " + e.message, { status: 500 });
  }
};