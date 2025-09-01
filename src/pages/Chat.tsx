import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chatStore";
import DesktopLayout from "@/components/DesktopLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PDFToText from "react-pdftotext";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// New ChatMessage component with expand/collapse functionality
const ChatMessage = ({ msg }) => {
  const [expanded, setExpanded] = useState(false);

  // Determine if the message text is long enough to need truncation
  const isLongText = msg.text.split('\n').length > 5 || msg.text.length > 300;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`flex gap-3 ${msg.isUser ? "flex-row" : "flex-row"}`}>
      {!msg.isUser && (
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
          <DotLottieReact
            src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
            loop
            autoplay
            className="w-6 h-6"
          />
        </div>
      )}

      <div className={`max-w-[75%] rounded-2xl px-4 py-3 bg-card text-foreground shadow-sm border border-border ${msg.isUser ? "ml-auto" : ""}`}>
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${!expanded && isLongText ? "line-clamp-5 overflow-hidden" : ""}`}
        >
          {msg.text}
        </p>

        {isLongText && (
          <button
            onClick={toggleExpand}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-2 transition-colors"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}

        <span className="text-xs mt-2 block text-muted-foreground">
          {msg.timestamp}
        </span>
      </div>

      {msg.isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-medium text-sm">U</span>
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCurrentChat, addMessage, addChat, setCurrentChat } = useChatStore();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentChat = getCurrentChat();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition() as SpeechRecognition;
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setMessage(prev => prev + finalTranscript + ' ');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  useEffect(() => {
    if (id) {
      setCurrentChat(id);
    } else {
      const newChat = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addChat(newChat);
      navigate(`/chat/${newChat.id}`, { replace: true });
    }
  }, [id, setCurrentChat, addChat, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Function to clean special symbols from text
  const cleanText = (text: string): string => {
    return text
      .replace(/[^\w\s.,!?()-]/g, '') // Remove special symbols except basic punctuation
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === "application/pdf") {
        PDFToText(file)
          .then((text) => {
            if (!text || text.trim().length < 10) {
              reject(new Error("No readable text found in PDF."));
            } else {
              resolve(cleanText(text.trim()));
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else if (file.type.startsWith("image/")) {
        const reader = new FileReader();
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
                  Authorization:
                    "Bearer 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",
                  "HTTP-Referer": window.location.origin,
                  "X-Title": "Justitia.ai Consultancy Bot",
                  "Content-Type": "application/json",
                },
              }
            );
            const extractedText = response.data.choices?.[0]?.message?.content || "";
            resolve(cleanText(extractedText));
          } catch (error: any) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      } else {
        reject(new Error("Unsupported file type"));
      }
    });
  };

  const handleSend = async () => {
    if ((!message.trim() && !selectedFile) || !currentChat) return;

    let fileText = "";
    if (selectedFile) {
      setIsLoading(true);
      try {
        fileText = await processFile(selectedFile);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to process file: ${error.message}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }

    const cleanedMessage = cleanText(message.trim());
    const userMessage = {
      id: Date.now().toString(),
      text: selectedFile
        ? `Uploaded content: ${cleanedMessage}\n\n${fileText}`
        : cleanedMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(currentChat.id, userMessage);
    setMessage("");
    setSelectedFile(null);
    setIsLoading(true);

    // Prepare context for AI
    const contextMessages = currentChat.messages
      .map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }))
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
Maintain context from the conversation and provide relevant legal advice or general responses. If a document is uploaded, analyze it with focus on legal compliance, risk assessment, and Indian law applicability. Provide clean, professional responses without special symbols or formatting characters.`,
            },
            ...contextMessages,
          ],
        },
        {
          headers: {
            Authorization:
              "Bearer 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",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Justitia.ai Consultancy Bot",
            "Content-Type": "application/json",
          },
        }
      );
      
      const aiResponseText = response.data.choices?.[0]?.message?.content || "Sorry, I couldn't process your request.";
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: cleanText(aiResponseText),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (error: any) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message}\n\nPlease try again or consult a lawyer.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    addMessage(currentChat.id, botResponse);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or image file (JPG, PNG).",
        variant: "destructive",
      });
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!currentChat) {
    return (
      <DesktopLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-foreground mb-2">Loading chat...</h2>
            <p className="text-muted-foreground">
              Please wait while we set up your conversation.
            </p>
          </div>
        </div>
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-none">
          <h2 className="font-medium text-foreground">{currentChat.title}</h2>
        </div>

        {/* Messages container with reduced padding */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="max-w-5xl mx-auto px-2 space-y-4">
            {currentChat.messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center mx-auto mb-4">
                  <DotLottieReact
                    src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
                    loop
                    autoplay
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
                <p className="text-muted-foreground">
                  Type a message, use voice input, or upload a document to begin chatting with Justitia.ai
                </p>
              </div>
            ) : (
              <>
                {/* Updated message mapping to use ChatMessage component */}
                {currentChat.messages.map((msg) => (
                  <ChatMessage key={msg.id} msg={msg} />
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                      <DotLottieReact
                        src="https://lottie.host/e52b3dc2-923d-47a2-b135-70a24b9c7ac4/m7qdPrHCBZ.lottie"
                        loop
                        autoplay
                        className="w-6 h-6"
                      />
                    </div>

                    <div className="bg-card border border-border rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Floating input bar with reduced padding */}
        <div className="pointer-events-none fixed bottom-0 left-20 w-full z-10 pb-4 pl-16">
          <div className="pointer-events-auto max-w-5xl mx-auto px-2">
            <div className="relative bg-card border border-border rounded-2xl shadow-xl p-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground shrink-0"
                onClick={handleFileButtonClick}
                disabled={isLoading}
                title="Upload file"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              
              <Button
                variant="ghost"
                size="sm"
                className={`shrink-0 ${
                  isListening 
                    ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={toggleVoiceRecognition}
                disabled={isLoading}
                title={isListening ? "Stop voice input" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <div className="flex items-center relative w-full rounded-full border-none ">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isListening
                      ? "Listening..."
                      : "Type your message, use voice input, or upload a document..."
                  }
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 bg-transparent border-none focus:outline-none rounded-full ${
                    isListening ? "ring-2 ring-red-300 dark:ring-red-700" : ""
                  }`}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  disabled={(!message.trim() && !selectedFile) || isLoading}
                  className="m-1 w-10 h-10 ml-4 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors"
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {selectedFile && (
              <div className="mt-2 ml-2">
                <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
                  📎 {selectedFile.name}
                </p>
              </div>
            )}
            
            {isListening && (
              <div className="mt-2 ml-2">
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md inline-block animate-pulse">
                  🎤 Listening for voice input...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add bottom padding to prevent content being hidden behind floating input */}
        <div className="h-20"></div>
      </div>
    </DesktopLayout>
  );
};

export default Chat;
