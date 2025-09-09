

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile, Mic, MicOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PDFToText from "react-pdftotext";

// Type declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentChat = getCurrentChat();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setMessage(prev => prev + finalTranscript + ' ');
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
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
  }, []);

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

  // Function to clean special symbols from text
  const cleanText = (text: string): string => {
    return text
      .replace(/[^\w\s.,!?()-]/g, '') // Remove special symbols except basic punctuation
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const processFile = async (file: File): Promise<string> => {
    try {
      if (file.type === "application/pdf") {
        const text = await PDFToText(file);
        if (!text || text.trim().length < 10) throw new Error("No readable text found in PDF.");
        return cleanText(text.trim());
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
                    Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Justitia.ai Consultancy Bot",
                    "Content-Type": "application/json",
                  },
                }
              );
              const extractedText = response.data.choices?.[0]?.message?.content || "";
              resolve(cleanText(extractedText));
            } catch (error: any) {
              reject(new Error(`Failed to extract text from image: ${error.message}`));
            }
          };
          reader.onerror = () => reject(new Error("Failed to read image file"));
          reader.readAsDataURL(file);
        });
      }
      throw new Error("Unsupported file type");
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to process file: ${error.message}`, variant: "destructive" });
      return "";
    }
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
Maintain context from the conversation and provide relevant legal advice or general responses. If a document is uploaded, analyze it with focus on legal compliance, risk assessment, and Indian law applicability. Provide clean, professional responses without special symbols or formatting characters.`,
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
      
      const aiResponseText = response.data.choices?.[0]?.message?.content || "Sorry, I couldn't process your request.";
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: cleanText(aiResponseText),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    } catch (error: any) {
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
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-chat-bg">
      <div className="p-3 border-b border-border">
        <h2 className="font-medium text-foreground">{currentChat.title}</h2>
      </div>

      {/* Messages container with reduced padding */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="px-1 space-y-4">
          {currentChat.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
              <p className="text-muted-foreground">Type a message, use voice input, or upload a document to begin chatting with Justitia.ai</p>
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
                
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.isUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card text-foreground shadow-sm border border-border"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  <span className={`text-xs mt-2 block ${
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
      </div>

      {/* Floating input bar */}
      <div className="pointer-events-none fixed bottom-0 left-10 w-full z-10 pb-4 pl-16">
  <div className="pointer-events-auto max-w-4xl mx-auto px-2">
    <div className="relative bg-card rounded-3xl p-3 flex items-center gap-2">
      
      {/* File Upload */}
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 text-muted-foreground"
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

      {/* Mic Button */}
      <Button
        variant="ghost"
        size="sm"
        className={`shrink-0 ${
          isListening ? "text-red-500 bg-transparent" : "text-muted-foreground"
        }`}
        onClick={toggleVoiceRecognition}
        disabled={isLoading}
        title={isListening ? "Stop voice input" : "Start voice input"}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>

      {/* Input + Send */}
      <div className="flex items-center relative w-full bg-[#262626] p-1 rounded-full">
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
  className="flex-1 px-4 py-3 bg-transparent border-none rounded-full focus:outline-none focus:ring-0"
/>

        <Button
          onClick={handleSend}
          size="icon"
          disabled={(!message.trim() && !selectedFile) || isLoading}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          title="Send message"
        >
          <Send className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>

    {/* File Preview */}
    {selectedFile && (
      <div className="mt-2 ml-2">
        <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
          📎 {selectedFile.name}
        </p>
      </div>
    )}

    {/* Listening Indicator */}
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
  );
};

export default ChatWindow;
