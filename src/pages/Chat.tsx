import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "@/store/chatStore";
import DesktopLayout from "@/components/DesktopLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCurrentChat, addMessage, addChat, setCurrentChat } = useChatStore();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = getCurrentChat();

  useEffect(() => {
    if (id) {
      setCurrentChat(id);
    } else {
      // Create new chat if no ID provided
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

  const handleSend = async () => {
    if (!message.trim() || !currentChat) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addMessage(currentChat.id, userMessage);
    setMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(userMessage.text),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      addMessage(currentChat.id, botResponse);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userText: string): string => {
    const responses = [
      "That's a great question! Let me help you with that. 🤖",
      "I understand what you're asking. Here's what I can tell you...",
      "Thanks for reaching out! I'm here to assist you with any questions.",
      "That's interesting! Let me buzz through my knowledge base to find the best answer.",
      "I'm happy to help! Could you tell me a bit more about what you're looking for?",
      "Great question! As your friendly AI bee, I'm always excited to help solve problems."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentChat) {
    return (
      <DesktopLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-foreground mb-2">Loading chat...</h2>
            <p className="text-muted-foreground">Please wait while we set up your conversation.</p>
          </div>
        </div>
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout>
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border">
          <h2 className="font-medium text-foreground">{currentChat.title}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat.messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
              <p className="text-muted-foreground">Type a message below to begin chatting with BeeBot</p>
            </div>
          ) : (
            <>
              {currentChat.messages.map((msg) => (
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
              ))}
              
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
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => toast({ title: "Feature coming soon!", description: "File attachment will be available soon." })}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => toast({ title: "Feature coming soon!", description: "Emoji picker will be available soon." })}
            >
              <Smile className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="bg-input border-border rounded-full pr-12 py-3 focus:ring-primary"
              />
              <Button
                onClick={handleSend}
                size="sm"
                disabled={!message.trim() || isLoading}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary-dark"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DesktopLayout>
  );
};

export default Chat;