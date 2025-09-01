import { Button } from "@/components/ui/button";
import { Search, Brain, Image, Zap, Plus } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MainContentProps {
  userName?: string;
}

const MainContent = ({ userName = "User" }: MainContentProps) => {
  const { addChat, setCurrentChat } = useChatStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addChat(newChat);
    navigate(`/chat/${newChat.id}`);
  };

  const handleActionClick = (action: string) => {
    toast({
      title: `${action} Feature`,
      description: `${action} functionality would be implemented here.`,
    });
  };

  const actionButtons = [
    { icon: Search, label: "Search" },
    { icon: Brain, label: "Reasoning" },
    { icon: Image, label: "Create Image" },
    { icon: Zap, label: "Deep Research" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">@BeeBot 4o</span>
          </div>
          <Button 
            onClick={handleNewChat}
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          {/* Welcome Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>

          {/* Welcome Message */}
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {getGreeting()}, {userName}
          </h1>
          <h2 className="text-xl text-foreground mb-8">
            How Can I <span className="text-primary">Assist You Today?</span>
          </h2>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            {actionButtons.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  onClick={() => handleActionClick(action.label)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-border hover:bg-muted"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Quick Start Text */}
          <p className="text-sm text-muted-foreground">
            ✨ Initiate a query or send a command to the AI...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;