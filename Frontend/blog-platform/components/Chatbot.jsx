"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "👋 Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("blog");

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now().toString(),
      text: trimmed,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, mode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI error");

      let replyText = "";
      if (typeof data.reply === "object" && data.reply.tasks_output) {
        // Find the last task, which should contain the final summary and meta description
        const lastTask = data.reply.tasks_output[data.reply.tasks_output.length - 1];
        if (lastTask && lastTask.raw) {
          // Use the raw text from the final task
          replyText = lastTask.raw;
        } else {
          replyText = "AI response received, but content could not be formatted.";
        }
      } else if (typeof data.reply === "string") {
        replyText = data.reply;
      } else {
        replyText = "AI response received, but content is in an unexpected format.";
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError("⚠️ Failed to fetch AI response.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <>
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
          isOpen && "hidden"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 max-w-[95%] h-[500px] shadow-xl z-50 flex flex-col rounded-2xl">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-base font-semibold text-center">AI Assistant</CardTitle>
          </CardHeader>

          <div className="text-sm font-semibold text-center mt-1">Mode</div>
          <div className="flex justify-center mb-1">
            <Button
              variant={mode === "blog" ? "default" : "outline"}
              onClick={() => setMode("blog")}
              size="sm"
            >
              Blog
            </Button>
            <Button
              variant={mode === "chat" ? "default" : "outline"}
              onClick={() => setMode("chat")}
              size="sm"
              className="ml-2"
            >
              Chat
            </Button>
          </div>

          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-muted/50"
            >
              {messages.map((msg) => {
                // Regex patterns to find the LAST occurrence of each section, which is likely the final output.
                // The (?=...) is a positive lookahead to ensure we capture up to the next heading without consuming it.
                const metaMatch = msg.text.match(/Meta Description:\s*([\s\S]*?)(?=\s*Summary:|\s*Hashtags:|$)/i);
                const contentMatch = msg.text.match(/Summary:\s*([\s\S]*?)(?=\s*Meta Description:|\s*Hashtags:|$)/is);
                const hashtagsMatch = msg.text.match(/#\w+/g);

                return (
                  <div key={msg.id} className={cn("flex", msg.isUser ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "whitespace-pre-wrap rounded-lg px-4 py-2 text-sm max-w-xs transition-all",
                      msg.isUser ? "bg-primary text-white" : "bg-white text-black shadow"
                    )}>
                      {msg.isUser ? (
                        msg.text
                      ) : (
                        mode === "blog" ? (
                          <div className="space-y-2">
                            <div className="font-bold text-blue-800">🧠 Blog Assistant</div>
                            
                            {/* Display Meta Description */}
                            {metaMatch && (
                                <div>
                                    <div className="font-semibold">Meta Description:</div>
                                    <div className="italic text-gray-700">{metaMatch[1].trim()}</div>
                                </div>
                            )}

                            {/* Display Summary */}
                            {contentMatch && (
                                <div>
                                    <div className="font-semibold">Summary:</div>
                                    <div className="text-gray-800">{contentMatch[1].trim()}</div>
                                </div>
                            )}

                            {/* Display Hashtags */}
                            {hashtagsMatch && (
                                <div>
                                    <div className="font-semibold">Hashtags:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {hashtagsMatch.map((tag, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                          </div>
                        ) : (
                          // Fallback to simple text display for chat mode
                          msg.text
                        )
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-2 text-sm rounded-lg shadow">⏳ Typing...</div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-center text-sm mt-2">{error}</div>
              )}
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={sendMessage} size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}