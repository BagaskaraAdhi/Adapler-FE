import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  RiSendPlane2Line,
  RiRobot2Line,
  RiUserLine,
  RiSparkling2Line,
} from "@remixicon/react";

// ---------- Markdown ringan (tanpa dependency tambahan) ----------
function parseInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong
        key={i}
        className="font-semibold text-indigo-700 dark:text-indigo-300"
      >
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

function renderMessageContent(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let listType = null;

  const flushList = (key) => {
    if (listItems.length) {
      const Tag = listType === "ol" ? "ol" : "ul";
      elements.push(
        <Tag
          key={key}
          className={`${
            listType === "ol" ? "list-decimal" : "list-disc"
          } list-inside space-y-1 my-1.5 pl-1`}
        >
          {listItems}
        </Tag>,
      );
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const bullet = trimmed.match(/^[*-]\s+(.*)/);
    const numbered = trimmed.match(/^\d+\.\s+(.*)/);

    if (bullet) {
      if (listType !== "ul") flushList(`l-${idx}`);
      listType = "ul";
      listItems.push(<li key={idx}>{parseInline(bullet[1])}</li>);
    } else if (numbered) {
      if (listType !== "ol") flushList(`l-${idx}`);
      listType = "ol";
      listItems.push(<li key={idx}>{parseInline(numbered[1])}</li>);
    } else {
      flushList(`l-${idx}`);
      if (trimmed === "") {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="leading-relaxed">
            {parseInline(line)}
          </p>,
        );
      }
    }
  });
  flushList("l-end");
  return elements;
}

// ---------- Komponen utama ----------
function AITutorPage() {
  const API_BASE_URL = "https://adapler-api.inidito.my.id";
  const token = localStorage.getItem("authToken");
  const [messages, setMessages] = useState([]);
  const [inputChat, setInputChat] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setMessages(data.data.chatHistory || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputChat.trim() || isChatLoading) return;
    const userMsg = { role: "user", pesan: inputChat };
    setMessages((prev) => [...prev, userMsg]);
    setInputChat("");
    setIsChatLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pesan: userMsg.pesan }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "model", pesan: data.data.reply },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "Jelaskan konsep fotosintesis secara sederhana",
    "Bantu aku memahami teorema Pythagoras",
    "Apa perbedaan revolusi dan rotasi bumi?",
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <RiRobot2Line size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            AI Tutor Assistant
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Diskusikan materi pelajaran dengan AI, kapan saja.
          </p>
        </div>
      </div>

      {/* Chat card */}
      <div className="flex h-[650px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white px-5 py-6 dark:from-gray-900 dark:to-gray-900">
          {messages.length === 0 && !isChatLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
                <RiSparkling2Line size={28} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Mulai percakapan dengan AI Tutor
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coba salah satu pertanyaan berikut:
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInputChat(s)}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div
                key={i}
                className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full shadow-sm ${
                    isUser
                      ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                  }`}
                >
                  {isUser ? (
                    <RiUserLine size={16} />
                  ) : (
                    <RiRobot2Line size={16} />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    isUser
                      ? "rounded-br-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                      : "rounded-bl-md border border-gray-100 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  }`}
                >
                  {renderMessageContent(m.pesan)}
                </div>
              </div>
            );
          })}

          {isChatLoading && (
            <div className="flex items-end gap-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <RiRobot2Line size={16} />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <input
            value={inputChat}
            onChange={(e) => setInputChat(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-800"
            placeholder="Tanya sesuatu..."
          />
          <button
            onClick={handleSendMessage}
            disabled={isChatLoading || !inputChat.trim()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RiSendPlane2Line size={18} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AITutorPage;
