"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Upload } from "lucide-react";
import PDFUploader from "@/components/ui/PDFuploader";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I am your AI Chatbot. Upload a PDF or ask me anything about it!",
    },
  ]);
  const [input, setInput] = useState("");
  const [pdfText, setPdfText] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Processing your query... (Server Response)" },
      ]);
    }, 1500);

    setInput("");
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      {/* Header */}
      <div className="w-full bg-teal-600 text-white text-center text-3xl font-semibold p-4 shadow-md">
        Neurality Health AI Chatbot
      </div>

      {/* Chat Container */}
      <div className="flex flex-col w-full h-full bg-white shadow-lg rounded-lg overflow-hidden mt-4">
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl shadow-md max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* PDF Upload Component */}
        <div className="p-1 bg-slate-500">
          <PDFUploader
            onUpload={(text) => {
              setPdfText(text);
              setMessages((prev) => [
                ...prev,
                { sender: "bot", text: `Extracted PDF Text: ${text.slice(0, 100)}...` },
              ]);
            }}
          />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t bg-white flex items-center space-x-3">
          <input
            type="text"
            className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-3 bg-teal-600 text-white rounded-full shadow-md hover:bg-teal-700 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
