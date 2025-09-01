import DesktopLayout from "@/components/DesktopLayout";
import { useChatStore } from "@/store/chatStore";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const History = () => {
  const { chats, deleteChat, setCurrentChat } = useChatStore();
  const navigate = useNavigate();

  const handleChatClick = (chatId: string) => {
    setCurrentChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
  };

  return (
    <DesktopLayout>
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Chat History</h1>
          
          {chats.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium text-foreground mb-2">No chats yet</h2>
              <p className="text-muted-foreground">Start a new conversation to see your chat history</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <button
                    onClick={() => handleChatClick(chat.id)}
                    className="flex-1 text-left"
                  >
                    <h3 className="font-medium text-foreground mb-1">
                      {chat.title || "Untitled Chat"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {chat.messages.length} messages
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                    </p>
                  </button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteChat(chat.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DesktopLayout>
  );
};

export default History;