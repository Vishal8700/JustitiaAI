import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatWindow = () => {
  const { user } = useChatStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm BeeBot, your friendly AI assistant. How can I help you today? 🐝",
      isUser: false,
      timestamp: "10:30 AM"
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (!user) {
      navigate("/"); // Redirect to MainContent if not logged in
    }
  }, [messages, user, navigate]);

  const handleSendMessage = (text: string) => {
    if (!user) {
      navigate("/"); // Ensure user is logged in before sending
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const responses = [
      "That's a great question! Let me help you with that. 🐝",
      "I understand what you're asking. Here's what I can tell you...",
      "Thanks for reaching out! I'm here to assist you with any questions.",
      "That's interesting! Let me buzz through my knowledge base to find the best answer.",
      "I'm happy to help! Could you tell me a bit more about what you're looking for?",
      "Great question! As your friendly AI bee, I'm always excited to help solve problems."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!user) {
    return null; // Or a loading state if preferred
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-chat-bg">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;