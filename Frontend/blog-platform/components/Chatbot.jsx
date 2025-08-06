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
        const lastTask = data.reply.tasks_output[data.reply.tasks_output.length - 1];
        if (lastTask && lastTask.raw) {
          const titleMatch = lastTask.raw.match(/Title:\s*([\s\S]*?)(?=Meta Description:|Summary:|Hashtags:|$)/i);
          const metaMatch = lastTask.raw.match(/Meta Description:\s*([\s\S]*?)(?=Title:|Summary:|Hashtags:|$)/i);
          const contentMatch = lastTask.raw.match(/Summary:\s*([\s\S]*?)(?=Title:|Meta Description:|Hashtags:|$)/is);
          const hashtagsMatch = lastTask.raw.match(/#\w+/g);

          const parsedReply = {
            title: titleMatch ? titleMatch[1].trim() : null,
            meta: metaMatch ? metaMatch[1].trim() : null,
            summary: contentMatch ? contentMatch[1].trim() : null,
            hashtags: hashtagsMatch || [],
            raw: lastTask.raw,
          };
          replyText = JSON.stringify(parsedReply);
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
                let parsedReply = {};
                let isParsed = false;
                try {
                  parsedReply = JSON.parse(msg.text);
                  isParsed = true;
                } catch (e) {
                  // Not a JSON object, so it's simple text.
                }

                return (
                  <div key={msg.id} className={cn("flex", msg.isUser ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "whitespace-pre-wrap rounded-lg px-4 py-2 text-sm max-w-xs transition-all",
                      msg.isUser ? "bg-primary text-white" : "bg-white text-black shadow"
                    )}>
                      {msg.isUser ? (
                        msg.text
                      ) : (
                        mode === "blog" && isParsed ? (
                          <div className="space-y-2">
                            <h3 className="font-bold text-blue-800">🧠 Blog Assistant</h3>
                            
                            {/* Content Heading with H1 and bold */}
                            <h1 className="text-2xl font-bold text-gray-900">Content</h1>

                            {/* Display Title with H2 and bold */}
                            {parsedReply.title && (
                                <div>
                                    <h2 className="text-lg font-bold">Title:</h2>
                                    <p className="text-gray-800">{parsedReply.title}</p>
                                </div>
                            )}

                            {/* Display Meta Description with H3 and bold */}
                            {parsedReply.meta && (
                                <div>
                                    <h3 className="font-bold text-base">Meta Description:</h3>
                                    <p className="italic text-gray-700">{parsedReply.meta}</p>
                                </div>
                            )}
                            
                            {/* Display Summary with H3 and bold */}
                            {parsedReply.summary && (
                                <div>
                                    <h3 className="font-bold text-base">Summary:</h3>
                                    <p className="text-gray-800">{parsedReply.summary}</p>
                                </div>
                            )}

                            {/* Display Hashtags with H3 and bold */}
                            {parsedReply.hashtags.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-base">Hashtags:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {parsedReply.hashtags.map((tag, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                          </div>
                        ) : (
                          // Fallback to simple text display for chat mode or if parsing fails
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