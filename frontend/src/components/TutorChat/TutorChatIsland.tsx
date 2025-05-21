import React, { useState, useRef, useEffect } from "react";
import { askTutor } from "../../utils/tutorChatService";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function TutorChatIsland() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = { role: "user" as const, text: input };
    setMessages(msgs => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const aiReply = await askTutor([...messages, userMessage]);
      setMessages(msgs => [...msgs, { role: "assistant", text: aiReply }]);
    } catch {
      setMessages(msgs => [...msgs, { role: "assistant", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full" aria-label="Ask Cramtime Tutor">
      <div className="overflow-y-auto max-h-[420px] border rounded mb-4 bg-gray-50 dark:bg-gray-900 px-4 py-3" tabIndex={0}>
        {messages.length === 0 && (
          <div className="text-gray-500 text-center py-6">Ask me any AP/SAT/ACT study question!</div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            aria-live="polite"
          >
            <div
              className={`rounded px-3 py-2 max-w-xs break-words shadow ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
              tabIndex={-1}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="my-2 flex justify-start">
            <div className="rounded px-3 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 animate-pulse">Thinking…</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="flex gap-2" onSubmit={handleSend} aria-label="Send message form">
        <input
          type="text"
          className="flex-grow px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          placeholder="Type your question…"
          aria-label="Question"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="bg-brand text-white px-4 py-2 rounded disabled:opacity-40"
          disabled={loading || !input.trim()}
          aria-label="Send Message"
        >
          Send
        </button>
      </form>
    </section>
  );
}