
import { useState, useRef, useEffect } from "react";
// import ChatMessage from "./ChatMessage";
import { useChatStore } from "@/store/chatStore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PDFToText from "react-pdftotext"; // Added missing import

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatWindow = () => {
  const { user, getCurrentChat, addMessage, addChat, setCurrentChat } = useChatStore();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = getCurrentChat();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
    } else if (!currentChat) {
      const newChat = {
        id: Date.now().toString(),
        title: "New Legal Consultation",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addChat(newChat);
      navigate(`/chat/${newChat.id}`, { replace: true });
    }
  }, [chatId, setCurrentChat, addChat, navigate, currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!message.trim() && !selectedFile || !currentChat) return;

    const userMessage = {
      id: Date.now().toString(),
      text: selectedFile ? `📄 Uploaded content: ${message.trim()}\n\n${await processFile(selectedFile)}` : message.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addMessage(currentChat.id, userMessage);
    setMessage("");
    setSelectedFile(null);
    setIsLoading(true);

    const contextMessages = currentChat.messages
      .map((msg) => ({ role: msg.isUser ? "user" : "assistant", content: msg.text }))
      .concat({ role: "user", content: userMessage.text });

    let botResponse;
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-small-3.2-24b-instruct:free",
          messages: [
            {
              role: "system",
              content: `You are Justitia.ai, an expert legal AI assistant specializing in Indian judiciary laws. Your expertise covers:
- Indian Contract Act, 1872
- Indian Evidence Act, 1872
- Code of Civil Procedure, 1908
- Indian Constitution
- Consumer Protection Act, 2019
- Arbitration and Conciliation Act, 1996
- Indian Partnership Act, 1932
- Sale of Goods Act, 1930
- Negotiable Instruments Act, 1881
- Transfer of Property Act, 1882
Maintain context from the conversation and provide relevant legal advice or general responses. If a document is uploaded, analyze it with focus on legal compliance, risk assessment, and Indian law applicability.`,
            },
            ...contextMessages,
          ],
        },
        {
          headers: {
            Authorization: "Bearer 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",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Justitia.ai Consultancy Bot",
            "Content-Type": "application/json",
          },
        }
      );
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: response.data.choices?.[0]?.message?.content || "Sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } catch (error) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message}\n\nPlease try again or consult a lawyer.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    addMessage(currentChat.id, botResponse);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      toast({ title: "Invalid File Type", description: "Please upload a PDF or image file (JPG, PNG).", variant: "destructive" });
    }
  };

  const processFile = async (file: File): Promise<string> => {
    try {
      if (file.type === "application/pdf") {
        const text = await PDFToText(file); // Now recognized due to import
        if (!text || text.trim().length < 10) throw new Error("No readable text found in PDF.");
        return text.trim();
      } else if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const dataUrl = e.target?.result as string;
              const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                  model: "mistralai/mistral-small-3.2-24b-instruct:free",
                  messages: [
                    {
                      role: "user",
                      content: [
                        {
                          type: "text",
                          text: `You are a specialized OCR system for legal documents. Extract ALL visible text from this image with these requirements:
1. EXTRACT COMPLETE TEXT: Transcribe every word, number, and symbol.
2. MAINTAIN STRUCTURE: Preserve formatting, paragraphs, and sections.
3. IDENTIFY DOCUMENT TYPE: Determine if it's a contract, agreement, etc.
4. PRESERVE LEGAL ELEMENTS: Focus on clause numbers, legal terminology, dates, signatures, party names, terms, and penalties.
5. OUTPUT FORMAT: Provide clean, readable text for legal analysis.
Text from image:`,
                        },
                        {
                          type: "image_url",
                          image_url: { url: dataUrl },
                        },
                      ],
                    },
                  ],
                },
                {
                  headers: {
                    Authorization: "Bearer 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",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Justitia.ai Consultancy Bot",
                    "Content-Type": "application/json",
                  },
                }
              );
              resolve(response.data.choices?.[0]?.message?.content || "");
            } catch (error) {
              reject(new Error(`Failed to extract text from image: ${error.message}`));
            }
          };
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(file);
        });
      }
      throw new Error("Unsupported file type");
    } catch (error) {
      toast({ title: "Error", description: `Failed to process file: ${error.message}`, variant: "destructive" });
      return "";
    }
  };

  if (!user || !currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground mb-2">Loading chat...</h2>
          <p className="text-muted-foreground">Please wait while we set up your conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-chat-bg">
      <div className="p-4 border-b border-border">
        <h2 className="font-medium text-foreground">{currentChat.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChat.messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
            <p className="text-muted-foreground">Type a message below to begin chatting with Justitia.ai</p>
          </div>
        ) : (
          currentChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {!msg.isUser && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.isUser 
                  ? "bg-primary text-primary-foreground ml-auto" 
                  : "bg-card text-foreground shadow-sm border border-border"
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-xs mt-1 block ${
                  msg.isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {msg.timestamp}
                </span>
              </div>
              
              {msg.isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-medium text-sm">U</span>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              🤖
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Paperclip className="w-4 h-4" />
            </Button>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => toast({ title: "Feature coming soon!", description: "Emoji picker will be available soon." })}
            disabled={isLoading}
          >
            <Smile className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or upload a document..."
              disabled={isLoading}
              className="bg-input border-border rounded-full pr-12 py-3 focus:ring-primary"
            />
            <Button
              onClick={handleSend}
              size="sm"
              disabled={!message.trim() && !selectedFile || isLoading}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary-dark"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {selectedFile && <p className="text-xs text-primary mt-1">Selected: {selectedFile.name}</p>}
      </div>
    </div>
  );
};

export default ChatWindow;