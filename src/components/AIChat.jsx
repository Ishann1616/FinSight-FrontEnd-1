import { useState, useRef, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const ROLEX_GREEN = "#006039";
const APPLE_BLUE = "#0071E3";

// NOTE: confirm this matches your actual route (check main.py's
// app.include_router(...) prefix for the agent router). Defaulting to "/chat".
const CHAT_ENDPOINT = "/agent/chat";

function getToken() {
  return localStorage.getItem("token");
}

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I'm your FinSight assistant. Ask me about your spending, budget, or forecasts." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMsg = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}${CHAT_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
        throw new Error(err.detail || "Something went wrong");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
    } catch (e) {
      setError(e.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't process that. Please try again.", isError: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col h-screen">
      <h1
        className="text-2xl mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: ROLEX_GREEN }}
      >
        AI Chat
      </h1>

      <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "text-white"
                  : msg.isError
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-100 text-gray-800"
              }`}
              style={msg.role === "user" ? { backgroundColor: APPLE_BLUE } : {}}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-400 rounded-2xl px-4 py-2 text-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="text-white text-sm font-medium rounded-xl px-5 py-2 disabled:opacity-50"
          style={{ backgroundColor: APPLE_BLUE }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
