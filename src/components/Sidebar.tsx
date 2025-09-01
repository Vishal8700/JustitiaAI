import { Home, Compass, Library, History, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Compass, label: "Explore" },
    { icon: Library, label: "Library" },
    { icon: History, label: "History" },
  ];

  const chatHistory = [
    "What's something you're learning...",
    "If you could teleport anywhere...",
    "What's one goal you want to a...",
    "Ask me anything, weird or min...",
    "How are you feeling today, me...",
    "What's one habit you wish you...",
  ];

  return (
    <div className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">🤖</span>
          </div>
          <span className="font-semibold text-foreground">BeeBot</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-sidebar-item-hover hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4 pb-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Tomorrow</h3>
          <div className="space-y-1">
            {chatHistory.map((chat, index) => (
              <button
                key={index}
                className="w-full text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-sidebar-item-hover transition-colors line-clamp-1"
              >
                {chat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">7 Days Ago</h3>
          <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-sidebar-item-hover transition-colors">
            Ask me anything, weird or min...
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Judha Marpaostya</p>
            <p className="text-xs text-muted-foreground truncate">judha.marpa@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;