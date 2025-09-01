import { cn } from "@/lib/utils";
import beeAvatar from "@/assets/bee-avatar.png";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
          <img src={beeAvatar} alt="BeeBot" className="w-6 h-6" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 relative",
        isUser 
          ? "bg-chat-user-bubble text-primary-foreground ml-auto" 
          : "bg-chat-bot-bubble text-foreground shadow-sm border border-border"
      )}>
        <p className="text-sm leading-relaxed">{message}</p>
        <span className={cn(
          "text-xs mt-1 block",
          isUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {timestamp}
        </span>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-medium text-sm">U</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;