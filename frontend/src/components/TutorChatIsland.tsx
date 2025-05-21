import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "../firebase/firebase";
import { Button } from "./UI/Button";

export default function TutorChatIsland() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setLoading(true);
    const functions = getFunctions();
    const chatTutor = httpsCallable(functions, "chatTutor");
    const user = auth.currentUser;
    const res: any = await chatTutor({ userId: user?.uid, message: input });
    setMessages(msgs => [...msgs, { role: "assistant", text: res.data.answer }]);
    setInput("");
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="h-64 overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"} style={{borderRadius: 8, padding: 6, display: "inline-block", margin: 2}}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask the AI tutor..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>Send</Button>
      </form>
    </div>
  );
} 