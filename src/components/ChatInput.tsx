import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-card border-t border-border">
      <div className="flex items-end gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Paperclip className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Smile className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="bg-chat-input border-border rounded-full pr-12 py-3 focus:ring-primary"
          />
          <Button
            onClick={handleSend}
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary-dark"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;